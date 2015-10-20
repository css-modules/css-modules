import postcss from 'postcss';
import Tokenizer from 'css-selector-tokenizer';

let hasOwnProperty = Object.prototype.hasOwnProperty;

function getSingleLocalNamesForComposes(selectors) {
  return selectors.nodes.map((node) => {
    if(node.type !== 'selector' || node.nodes.length !== 1) {
      throw new Error('composition is only allowed when selector is single :local class name not in "' +
        Tokenizer.stringify(selectors) + '"');
    }
    node = node.nodes[0];
    if(node.type !== 'nested-pseudo-class' || node.name !== 'local' || node.nodes.length !== 1) {
      throw new Error('composition is only allowed when selector is single :local class name not in "' +
        Tokenizer.stringify(selectors) + '", "' + Tokenizer.stringify(node) + '" is weird');
    }
    node = node.nodes[0];
    if(node.type !== 'selector' || node.nodes.length !== 1) {
      throw new Error('composition is only allowed when selector is single :local class name not in "' +
        Tokenizer.stringify(selectors) + '", "' + Tokenizer.stringify(node) + '" is weird');
    }
    node = node.nodes[0];
    if(node.type !== 'class') { // 'id' is not possible, because you can't compose ids
      throw new Error('composition is only allowed when selector is single :local class name not in "' +
        Tokenizer.stringify(selectors) + '", "' + Tokenizer.stringify(node) + '" is weird');
    }
    return node.name;
  });
}

const processor = postcss.plugin('postcss-modules-scope', function(options) {
  return (css) => {
    let generateScopedName = options && options.generateScopedName || processor.generateScopedName;

    let exports = {};

    function exportScopedName(name) {
      let scopedName = generateScopedName(name, css.source.input.from, css.source.input.css);
      exports[name] = exports[name] || [];
      if(exports[name].indexOf(scopedName) < 0) {
        exports[name].push(scopedName);
      }
      return scopedName;
    }

    function localizeNode(node) {
      let newNode = Object.create(node);
      switch(node.type) {
        case 'selector':
          newNode.nodes = node.nodes.map(localizeNode);
          return newNode;
        case 'class':
        case 'id':
          let scopedName = exportScopedName(node.name);
          newNode.name = scopedName;
          return newNode;
      }
      throw new Error(node.type + ' ("' + Tokenizer.stringify(node) + '") is not allowed in a :local block');
    }

    function traverseNode(node) {
      switch(node.type) {
        case 'nested-pseudo-class':
          if(node.name === 'local') {
            if(node.nodes.length !== 1) {
              throw new Error('Unexpected comma (",") in :local block');
            }
            return localizeNode(node.nodes[0]);
          }
          /* falls through */
        case 'selectors':
        case 'selector':
          let newNode = Object.create(node);
          newNode.nodes = node.nodes.map(traverseNode);
          return newNode;
      }
      return node;
    }

    // Find any :import and remember imported names
    let importedNames = {};
    css.walkRules(rule => {
      if(/^:import\(.+\)$/.test(rule.selector)) {
        rule.walkDecls(decl => {
          importedNames[decl.prop] = true;
        });
      }
    });

    // Find any :local classes
    css.walkRules(rule => {
      let selector = Tokenizer.parse(rule.selector);
      let newSelector = traverseNode(selector);
      rule.selector = Tokenizer.stringify(newSelector);
      rule.walkDecls(/composes|compose-with/, decl => {
        let localNames = getSingleLocalNamesForComposes(selector);
        let classes = decl.value.split(/\s+/);
        classes.forEach((className) => {
          if(hasOwnProperty.call(importedNames, className)) {
            localNames.forEach((exportedName) => {
              exports[exportedName].push(className);
            });
          } else if(hasOwnProperty.call(exports, className)) {
            localNames.forEach((exportedName) => {
              exports[className].forEach((item) => {
                exports[exportedName].push(item);
              });
            });
          } else {
            throw decl.error(`referenced class name "${className}" in ${decl.prop} not found`);
          }
        });
        decl.remove();
      });
      
      rule.walkDecls(decl => {
        var tokens = decl.value.split(/(,|'[^']*'|"[^"]*")/);
        tokens = tokens.map((token, idx) => {
          if(idx === 0 || tokens[idx - 1] === ',') {
            let localMatch = /^(\s*):local\s*\((.+?)\)/.exec(token);
            if(localMatch) {
              return localMatch[1] + exportScopedName(localMatch[2]) + token.substr(localMatch[0].length);
            } else {
              return token;
            }
          } else {
            return token;
          }
        });
        decl.value = tokens.join('');
      });
    });

    // Find any :local keyframes
    css.walkAtRules(atrule => {
      if(/keyframes$/.test(atrule.name)) {
        var localMatch = /^\s*:local\s*\((.+?)\)\s*$/.exec(atrule.params);
        if(localMatch) {
          atrule.params = exportScopedName(localMatch[1]);
        }
      }
    });

    // If we found any :locals, insert an :export rule
    let exportedNames = Object.keys(exports);
    if (exportedNames.length > 0) {
      css.append(postcss.rule({
        selector: `:export`,
        nodes: exportedNames.map(exportedName => postcss.decl({
          prop: exportedName,
          value: exports[exportedName].join(' '),
          raws: { before: '\n  ' },
          _autoprefixerDisabled: true
        }))
      }));
    }
  };
});

processor.generateScopedName = function(exportedName, path) {
  let sanitisedPath = path.replace(/\.[^\.\/\\]+$/, '').replace(/[\W_]+/g, '_').replace(/^_|_$/g, '');
  return `_${sanitisedPath}__${exportedName}`;
};

export default processor;
