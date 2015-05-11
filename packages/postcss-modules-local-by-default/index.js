var postcss = require('postcss');

module.exports = postcss.plugin('postcss-local-scope', function () {
  return function(css) {
    css.eachRule(function(rule) {
      rule.selector = rule.selector
        .replace(/\.global\[selector="(.*?)"\]/g, function(global, selector) {
          return selector.replace(/\./g, '___LOCAL_SCOPE_GLOBAL_DOT___');
        })
        .replace(/\.local\[(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)\]/g, '.$1')
        .replace(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, '.local[$1]') // source: http://stackoverflow.com/questions/448981/what-characters-are-valid-in-css-class-names-selectors
        .replace(/___LOCAL_SCOPE_GLOBAL_DOT___/g, '.');
    });
  };
});
