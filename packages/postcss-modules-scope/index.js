"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

var _postcss = require("postcss");

var _postcss2 = _interopRequireDefault(_postcss);

var localRegexp = /^\:local\(\.(\w+)\)$/;

var processor = function processor(css, result) {
  var exports = {};

  // Find any :local declarations
  css.eachRule(function (rule) {
    var match = rule.selector.match(localRegexp);
    if (match) {
      var _match = _slicedToArray(match, 2);

      var _ = _match[0];
      var exportedName = _match[1];
      var generatedClassName = processor.generateClassName(css.source.input.from, exportedName);
      exports[exportedName] = exports[exportedName] || [];
      exports[exportedName].push(generatedClassName);
      rule.selector = "." + generatedClassName;
    }
  });

  // If we found any :locals, insert an :export rule
  var exportedNames = Object.keys(exports);
  if (exportedNames.length > 0) {
    css.prepend(_postcss2["default"].rule({
      selector: ":export",
      before: "\n",
      nodes: exportedNames.map(function (exportedName) {
        return _postcss2["default"].decl({
          prop: exportedName,
          value: exports[exportedName].join(" "),
          before: "\n  "
        });
      })
    }));
  }
};

processor.generateClassName = function (path, exportedName) {
  var sanitisedPath = path.replace(/\.[^\.\/\\]+$/, "").replace(/[\W_]+/g, "_").replace(/^_|_$/g, "");
  return "_" + sanitisedPath + "__" + exportedName;
};

exports["default"] = processor;
module.exports = exports["default"];
