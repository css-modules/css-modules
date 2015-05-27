'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _cssSelectorParser = require('css-selector-parser');

var processor = function processor(css, result) {
  var parser = new _cssSelectorParser.CssSelectorParser();
  var exports = {};

  // Find any :local declarations
  css.eachRule(function (rule) {
    var parsed = parser.parse(rule.selector),
        selectors = parsed.type === 'ruleSet' ? [parsed] : parsed.selectors,
        converted = selectors.map(function (selector) {
      var pseudos = selector.rule.pseudos || [];
      pseudos.forEach(function (pseudo) {
        if (pseudo.name === 'local') {}
      });
      return parser.render(selector);
    });
    rule.selector = converted.join(',');
  });

  // If we found any :locals, insert :export rules
  Objects.keys();
};

exports['default'] = processor;
module.exports = exports['default'];
