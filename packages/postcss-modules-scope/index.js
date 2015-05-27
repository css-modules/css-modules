'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var processor = function processor(css, result) {};

processor.defaultRandomStr = function () {
  return Math.random().toString(36).substr(2, 8);
};
processor.getRandomStr = processor.defaultRandomStr; // Easy to be mocked out

exports['default'] = processor;
module.exports = exports['default'];
