'use strict';

const postcss = require('postcss');
const Tokenizer = require('css-selector-tokenizer');

const hasOwnProperty = Object.prototype.hasOwnProperty;

function getSingleLocalNamesForComposes(selectors) {
  return selectors.nodes.map(node => {
    if (node.type !== 'selector' || node.nodes.length !== 1) {
      throw new Error(
        'composition is only allowed when selector is single :local class name not in "' +
          Tokenizer.stringify(selectors) +
          '"'
      );
    }
    node = node.nodes[0];
    if (
      node.type !== 'nested-pseudo-class' ||
      node.name !== 'local' ||
      node.nodes.length !== 1
    ) {
      throw new Error(
        'composition is only allowed when selector is single :local class name not in "' +
          Tokenizer.stringify(selectors) +
          '", "' +
          Tokenizer.stringify(node) +
          '" is weird'
      );
    }
    node = node.nodes[0];
    if (node.type !== 'selector' || node.nodes.length !== 1) {
      throw new Error(
        'composition is only allowed when selector is single :local class name not in "' +
          Tokenizer.stringify(selectors) +
          '", "' +
          Tokenizer.stringify(node) +
          '" is weird'
      );
    }
    node = node.nodes[0];
    if (node.type !== 'class') {
      // 'id' is not possible, because you can't compose ids
      throw new Error(
        'composition is only allowed when selector is single :local class name not in "' +
          Tokenizer.stringify(selectors) +
          '", "' +
          Tokenizer.stringify(node) +
          '" is weird'
      );
    }
    return node.name;
  });
}

const processor = postcss.plugin('postcss-modules-scope', function(options) {
  return css => {
    const generateScopedName =
      (options && options.generateScopedName) || processor.generateScopedName;

    const exports = Object.create(null);

    function exportScopedName(name) {
      const scopedName = generateScopedName(
        name,
        css.source.input.from,
        css.source.input.css
      );
      exports[name] = exports[name] || [];
      if (exports[name].indexOf(scopedName) < 0) {
        exports[name].push(scopedName);
      }
      return scopedName;
    }

    function localizeNode(node) {
      const newNode = Object.create(node);
      switch (node.type) {
        case 'selector':
          newNode.nodes = node.nodes.map(localizeNode);
          return newNode;
        case 'class':
        case 'id': {
          newNode.name = exportScopedName(node.name);
          return newNode;
        }
      }
      throw new Error(
        node.type +
          ' ("' +
          Tokenizer.stringify(node) +
          '") is not allowed in a :local block'
      );
    }

    function traverseNode(node) {
      switch (node.type) {
        case 'nested-pseudo-class':
          if (node.name === 'local') {
            if (node.nodes.length !== 1) {
              throw new Error('Unexpected comma (",") in :local block');
            }
            return localizeNode(node.nodes[0]);
          }
        /* falls through */
        case 'selectors':
        case 'selector': {
          const newNode = Object.create(node);
          newNode.nodes = node.nodes.map(traverseNode);
          return newNode;
        }
      }
      return node;
    }

    // Find any :import and remember imported names
    const importedNames = {};
    css.walkRules(rule => {
      if (/^:import\(.+\)$/.test(rule.selector)) {
        rule.walkDecls(decl => {
          importedNames[decl.prop] = true;
        });
      }
    });

    // Find any :local classes
    css.walkRules(rule => {
      const selector = Tokenizer.parse(rule.selector);
      const newSelector = traverseNode(selector);
      rule.selector = Tokenizer.stringify(newSelector);
      rule.walkDecls(/composes|compose-with/, decl => {
        const localNames = getSingleLocalNamesForComposes(selector);
        const classes = decl.value.split(/\s+/);
        classes.forEach(className => {
          const global = /^global\(([^\)]+)\)$/.exec(className);
          if (global) {
            localNames.forEach(exportedName => {
              exports[exportedName].push(global[1]);
            });
          } else if (hasOwnProperty.call(importedNames, className)) {
            localNames.forEach(exportedName => {
              exports[exportedName].push(className);
            });
          } else if (hasOwnProperty.call(exports, className)) {
            localNames.forEach(exportedName => {
              exports[className].forEach(item => {
                exports[exportedName].push(item);
              });
            });
          } else {
            throw decl.error(
              `referenced class name "${className}" in ${decl.prop} not found`
            );
          }
        });
        decl.remove();
      });

      rule.walkDecls(decl => {
        var tokens = decl.value.split(/(,|'[^']*'|"[^"]*")/);
        tokens = tokens.map((token, idx) => {
          if (idx === 0 || tokens[idx - 1] === ',') {
            const localMatch = /^(\s*):local\s*\((.+?)\)/.exec(token);
            if (localMatch) {
              return (
                localMatch[1] +
                exportScopedName(localMatch[2]) +
                token.substr(localMatch[0].length)
              );
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
      if (/keyframes$/i.test(atrule.name)) {
        var localMatch = /^\s*:local\s*\((.+?)\)\s*$/.exec(atrule.params);
        if (localMatch) {
          atrule.params = exportScopedName(localMatch[1]);
        }
      }
    });

    // If we found any :locals, insert an :export rule
    const exportedNames = Object.keys(exports);
    if (exportedNames.length > 0) {
      const exportRule = postcss.rule({ selector: ':export' });
      exportedNames.forEach(exportedName =>
        exportRule.append({
          prop: exportedName,
          value: exports[exportedName].join(' '),
          raws: { before: '\n  ' }
        })
      );
      css.append(exportRule);
    }
  };
});

processor.generateScopedName = function(exportedName, path) {
  const sanitisedPath = path
    .replace(/\.[^\.\/\\]+$/, '')
    .replace(/[\W_]+/g, '_')
    .replace(/^_|_$/g, '');
  return `_${sanitisedPath}__${exportedName}`;
};

module.exports = processor;
