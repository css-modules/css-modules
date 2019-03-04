'use strict';

const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

const hasOwnProperty = Object.prototype.hasOwnProperty;

function getSingleLocalNamesForComposes(root) {
  return root.nodes.map(node => {
    if (node.type !== 'selector' || node.nodes.length !== 1) {
      throw new Error(
        `composition is only allowed when selector is single :local class name not in "${root}"`
      );
    }
    node = node.nodes[0];
    if (
      node.type !== 'pseudo' ||
      node.value !== ':local' ||
      node.nodes.length !== 1
    ) {
      throw new Error(
        'composition is only allowed when selector is single :local class name not in "' +
          root +
          '", "' +
          node +
          '" is weird'
      );
    }
    node = node.first;
    if (node.type !== 'selector' || node.length !== 1) {
      throw new Error(
        'composition is only allowed when selector is single :local class name not in "' +
          root +
          '", "' +
          node +
          '" is weird'
      );
    }
    node = node.first;
    if (node.type !== 'class') {
      // 'id' is not possible, because you can't compose ids
      throw new Error(
        'composition is only allowed when selector is single :local class name not in "' +
          root +
          '", "' +
          node +
          '" is weird'
      );
    }
    return node.value;
  });
}

const processor = postcss.plugin('postcss-modules-scope', function(options) {
  return css => {
    const generateScopedName =
      (options && options.generateScopedName) || processor.generateScopedName;

    const exports = Object.create(null);

    function exportScopedName(name, rawName) {
      const scopedName = generateScopedName(
        rawName ? rawName : name,
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
      switch (node.type) {
        case 'selector':
          node.nodes = node.map(localizeNode);
          return node;
        case 'class':
          return selectorParser.className({
            value: exportScopedName(
              node.value,
              node.raws && node.raws.value ? node.raws.value : null
            ),
          });
        case 'id': {
          return selectorParser.id({
            value: exportScopedName(
              node.value,
              node.raws && node.raws.value ? node.raws.value : null
            ),
          });
        }
      }
      throw new Error(
        `${node.type} ("${node}") is not allowed in a :local block`
      );
    }

    function traverseNode(node) {
      switch (node.type) {
        case 'pseudo':
          if (node.value === ':local') {
            if (node.nodes.length !== 1) {
              throw new Error('Unexpected comma (",") in :local block');
            }
            const selector = localizeNode(node.first, node.spaces);
            // move the spaces that were around the psuedo selector to the first
            // non-container node
            selector.first.spaces = node.spaces;

            node.replaceWith(selector);
            return;
          }
        /* falls through */
        case 'root':
        case 'selector': {
          node.each(traverseNode);
          break;
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
      if (
        rule.nodes &&
        rule.selector.slice(0, 2) === '--' &&
        rule.selector.slice(-1) === ':'
      ) {
        // ignore custom property set
        return;
      }

      let parsedSelector = selectorParser().astSync(rule);

      rule.selector = traverseNode(parsedSelector.clone()).toString();
      // console.log(rule.selector);
      rule.walkDecls(/composes|compose-with/, decl => {
        const localNames = getSingleLocalNamesForComposes(parsedSelector);
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
          raws: { before: '\n  ' },
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
  return `_${sanitisedPath}__${exportedName}`.trim();
};

module.exports = processor;
