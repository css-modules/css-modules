var test = require('tape');
var postcss = require('postcss');
var plugin = require('./');
var name = require('./package.json').name;

var tests = [
  {
    should: 'scope selectors',
    input: '.foobar {}',
    expected: '.local[foobar] {}'
  },
  {
    should: 'scope multiple selectors',
    input: '.foo, .baz {}',
    expected: '.local[foo], .local[baz] {}'
  },
  {
    should: 'scope sibling selectors',
    input: '.foo ~ .baz {}',
    expected: '.local[foo] ~ .local[baz] {}'
  },
  {
    should: 'scope psuedo elements',
    input: '.foo:after {}',
    expected: '.local[foo]:after {}'
  },
  {
    should: 'scope media queries',
    input: '@media only screen { .foo {} }',
    expected: '@media only screen { .local[foo] {} }'
  },
  {
    should: 'allow global selectors with special .global[selector="..."] syntax',
    input: '.global[selector=".foo .bar"] {}',
    expected: '.foo .bar {}'
  },
  {
    should: 'ignore selectors that are already local',
    input: '.local[foobar] {}',
    expected: '.local[foobar] {}'
  },
  {
    should: 'ignore nested selectors that are already local',
    input: '.local[foo] .local[bar] {}',
    expected: '.local[foo] .local[bar] {}'
  },
  {
    should: 'ignore multiple selectors that are already local',
    input: '.local[foo], .local[bar] {}',
    expected: '.local[foo], .local[bar] {}'
  },
  {
    should: 'ignore sibling selectors that are already local',
    input: '.local[foo] ~ .local[bar] {}',
    expected: '.local[foo] ~ .local[bar] {}'
  },
  {
    should: 'ignore psuedo elements that are already local',
    input: '.local[foo]:after {}',
    expected: '.local[foo]:after {}'
  }
];

function process (css, options) {
    return postcss(plugin(options)).process(css).css;
}

test(name, function (t) {
    t.plan(tests.length);

    tests.forEach(function (test) {
        var options = test.options || {};
        t.equal(process(test.input, options), test.expected, 'should ' + test.should);
    });
});

test('should use the postcss plugin api', function (t) {
    t.plan(2);
    t.ok(plugin().postcssVersion, 'should be able to access version');
    t.equal(plugin().postcssPlugin, name, 'should be able to access name');
});
