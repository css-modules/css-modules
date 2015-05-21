var postcss = require('postcss');

var ESCAPED_DOT = ' ___LOCAL_SCOPE__ESCAPED_DOT___ ';

module.exports = postcss.plugin('postcss-local-scope', function () {
  return function(css, result) {
    css.eachRule(function(rule) {
      rule.selector = rule.selector
        .split(',')
        .map(transformSelector.bind(null, rule))
        .join(',');
    });
  };
});

function transformSelector(rule, selector) {
  // Syntax warnings
  var trimmedSelector = selector.trim();
  if (!/^\./.test(trimmedSelector) && !/^\:local/.test(trimmedSelector)) {
    if (!/^\:global/.test(trimmedSelector)) {
      throw rule.error('Global selector detected in local context. Does this selector really need to be global? If so, you need to explicitly export it into the global scope with ":global", e.g. ":global '+trimmedSelector+'"', { plugin: 'postcss-local-scope' });
    }
  }

  return selector
    .replace(/\:global\((.*?)\)/g, escapeDots)
    .replace(/\:global (.*)/g, escapeDots)
    .replace(/\.local\[(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)\]/g, '.$1') // source: http://stackoverflow.com/questions/448981/what-characters-are-valid-in-css-class-names-selectors
    .replace(/\:local\(\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)\)/g, '.$1')
    .replace(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, ':local(.$1)')
    .replace(new RegExp(ESCAPED_DOT, 'g'), '.');
}

function escapeDots(match, p1) {
  return p1.replace(/\./g, ESCAPED_DOT);
}
