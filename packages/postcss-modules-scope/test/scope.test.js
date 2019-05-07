var fs = require('fs');
var path = require('path');
var postcss = require('postcss');

var processor = require('../src');

function generateInvalidCSS(css) {
  css.walkDecls(function(decl) {
    decl.value = decl.value.replace(/_colon_/g, ':'); // because using a : in the tests would make it invalid CSS.
  });
}

const { generateScopedName } = processor;

const readIfExists = file => {
  if (!fs.existsSync(file)) return;
  if (path.extname(file) === '.js') return require(file);

  let content = fs.readFileSync(file, 'utf-8');

  if (path.extname(file) === '.json') content = JSON.parse(content);
  else content = content.replace(/\r\n?/g, '\n').replace(/\n$/, '');

  return content;
};

describe('test-cases', function() {
  const defaultOptions = {
    generateScopedName(exportedName, inputPath) {
      return generateScopedName(exportedName, inputPath.replace(/^[A-Z]:/, ''));
    },
  };

  const testDir = path.join(__dirname, 'test-cases');

  test.each(
    fs
      .readdirSync(testDir)
      .map(testCaseDir => [
        testCaseDir.replace(/-/g, ' '),
        readIfExists(path.join(testDir, testCaseDir, 'source.css')),
        readIfExists(path.join(testDir, testCaseDir, 'expected.css')),
        (
          readIfExists(path.join(testDir, testCaseDir, 'expected.error.txt')) ||
          ''
        ).split('\n')[0],
        readIfExists(path.join(testDir, testCaseDir, 'config.json')),
        readIfExists(path.join(testDir, testCaseDir, 'options.js')),
      ])
  )(
    'should %s. ',
    (
      name,
      input,
      expected,
      expectedError,
      config = { from: '/input' },
      options = defaultOptions
    ) => {
      const pipeline = postcss([generateInvalidCSS, processor(options)]);

      if (expectedError) {
        expect(() => pipeline.process(input, config).css).toThrow(
          new RegExp(expectedError)
        );
      } else {
        expect(pipeline.process(input, config).css).toEqual(expected);
      }
    }
  );
});
