var postcss = require('postcss');

module.exports = postcss.plugin('postcss-local-scope', function () {
  return function(css) {
    css.eachRule(function(rule) {
      // source: http://stackoverflow.com/questions/448981/what-characters-are-valid-in-css-class-names-selectors
      rule.selector = rule.selector.replace(/.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, '.local[$1]');
    });
  };
});
