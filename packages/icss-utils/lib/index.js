'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var matchConstName = /[\w-]+/g;

var replace = function replace(declarations, object, propName) {
  var matches = undefined;
  while (matches = matchConstName.exec(object[propName])) {
    var replacement = declarations[matches[0]];
    if (replacement) {
      object[propName] = object[propName].slice(0, matches.index) + replacement + object[propName].slice(matchConstName.lastIndex);
      matchConstName.lastIndex -= matches[0].length - replacement.length;
    }
  }
};

exports['default'] = function (css, translations) {
  css.walkDecls(function (decl) {
    return replace(translations, decl, 'value');
  });
  css.walkAtRules('media', function (atRule) {
    return replace(translations, atRule, 'params');
  });
};

module.exports = exports['default'];