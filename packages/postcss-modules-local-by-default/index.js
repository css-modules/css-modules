var postcss = require('postcss');
var Tokenizer = require('css-selector-tokenizer');

function localizeNodes(nodes) {
  var isGlobalContext = false;

  return nodes
    .map(function(node, i) {
      var newNode = node;

      if (isGlobal(newNode)) {
        isGlobalContext = true;
        return null;
      }

      if (newNode.type === 'spacing' && isGlobal(nodes[i-1])) {
        return null;
      }

      if (!isGlobalContext && node.type === 'class') {
        newNode = { type: 'nested-pseudo-class', name: 'local', nodes: [node] }
      } else if (isNestedGlobal(newNode)) {
        newNode = node.nodes[0];
      } else if (!isNestedLocal(newNode) && newNode.nodes) {
        newNode.nodes = localizeNodes(newNode.nodes);
      }

      return newNode;
    }).filter(function(node) {
      return node !== null
    });
}

function isGlobal(node) {
  return node.type === 'pseudo-class' && node.name === 'global';
}

function isNestedGlobal(node) {
  return node.type === 'nested-pseudo-class' && node.name === 'global';
}

function isNestedLocal(node) {
 return node.type === 'nested-pseudo-class' && node.name === 'local';
}

module.exports = postcss.plugin('postcss-modules-local-by-default', function () {
  return function(css, result) {
    css.eachRule(function(rule) {
      var selector = Tokenizer.parse(rule.selector);
      selector.nodes = localizeNodes(selector.nodes);
      rule.selector = Tokenizer.stringify(selector).trim();
    });
  };
});
