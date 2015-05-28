"use strict";

/*globals describe it */

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var postcss = require("postcss");
var processor = require("../");

var pipeline = postcss([processor]);

function normalize(str) {
  return str.replace(/\r\n?/g, "\n");
}

var generateScopedName = processor.generateScopedName;

describe("test-cases", function() {
  var testDir = path.join(__dirname, "test-cases");
  fs.readdirSync(testDir).forEach(function(testCase) {
    if(fs.existsSync(path.join(testDir, testCase, "source.css"))) {
      it("should " + testCase.replace(/-/g, " "), function() {
        var input = normalize(fs.readFileSync(path.join(testDir, testCase, "source.css"), "utf-8"));
        var expected = normalize(fs.readFileSync(path.join(testDir, testCase, "expected.css"), "utf-8"));
        var config = { from: "/input" };
        if(fs.existsSync(path.join(testDir, testCase, "config.json"))) {
          config = JSON.parse(fs.readFileSync(path.join(testDir, testCase, "config.json"), "utf-8"));
        }
        processor.generateScopedName = function(inputPath, exportedName) {
          var normalizedPath = inputPath.replace(/^[A-Z]:/, "");
          return generateScopedName(normalizedPath, exportedName);
        };
        assert.equal(pipeline.process(input, config).css, expected);
      });
    }
  });
});
