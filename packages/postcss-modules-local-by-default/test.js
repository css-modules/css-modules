var test = require('tape');
var postcss = require('postcss');
var plugin = require('./');
var name = require('./package.json').name;

var tests = [
  {
    should: 'scope selectors',
    input: '.foobar {}',
    expected: ':local(.foobar) {}'
  },
  {
    should: 'scope multiple selectors',
    input: '.foo, .baz {}',
    expected: ':local(.foo), :local(.baz) {}'
  },
  {
    should: 'scope sibling selectors',
    input: '.foo ~ .baz {}',
    expected: ':local(.foo) ~ :local(.baz) {}'
  },
  {
    should: 'scope psuedo elements',
    input: '.foo:after {}',
    expected: ':local(.foo):after {}'
  },
  {
    should: 'scope media queries',
    input: '@media only screen { .foo {} }',
    expected: '@media only screen { :local(.foo) {} }'
  },
  {
    should: 'allow narrow global selectors',
    input: ':global(.foo .bar) {}',
    expected: '.foo .bar {}'
  },
  {
    should: 'allow broad global selectors',
    input: ':global .foo .bar {}',
    expected: '.foo .bar {}'
  },
  {
    should: 'allow multiple narrow global selectors',
    input: ':global(.foo), :global(.bar) {}',
    expected: '.foo, .bar {}'
  },
  {
    should: 'allow multiple broad global selectors',
    input: ':global .foo, :global .bar {}',
    expected: '.foo, .bar {}'
  },
  {
    should: 'allow narrow global selectors nested inside local styles',
    input: '.foo :global(.foo .bar) {}',
    expected: ':local(.foo) .foo .bar {}'
  },
  {
    should: 'allow broad global selectors nested inside local styles',
    input: '.foo :global .foo .bar {}',
    expected: ':local(.foo) .foo .bar {}'
  },
  {
    should: 'allow narrow global selectors appended to local styles',
    input: '.foo:global(.foo.bar) {}',
    expected: ':local(.foo).foo.bar {}'
  },
  {
    should: 'ignore selectors that are already local',
    input: ':local(.foobar) {}',
    expected: ':local(.foobar) {}'
  },
  {
    should: 'ignore nested selectors that are already local',
    input: ':local(.foo) :local(.bar) {}',
    expected: ':local(.foo) :local(.bar) {}'
  },
  {
    should: 'ignore multiple selectors that are already local',
    input: ':local(.foo), :local(.bar) {}',
    expected: ':local(.foo), :local(.bar) {}'
  },
  {
    should: 'ignore sibling selectors that are already local',
    input: ':local(.foo) ~ :local(.bar) {}',
    expected: ':local(.foo) ~ :local(.bar) {}'
  },
  {
    should: 'ignore psuedo elements that are already local',
    input: ':local(.foo):after {}',
    expected: ':local(.foo):after {}'
  },
  {
    should: 'convert nested selectors that are already local using the old syntax into the new local syntax',
    input: '.local[foo] .local[bar] {}',
    expected: ':local(.foo) :local(.bar) {}'
  },
  {
    should: 'convert multiple selectors that are already local using the old syntax into the new local syntax',
    input: '.local[foo], .local[bar] {}',
    expected: ':local(.foo), :local(.bar) {}'
  },
  {
    should: 'convert sibling selectors that are already local using the old syntax into the new local syntax',
    input: '.local[foo] ~ .local[bar] {}',
    expected: ':local(.foo) ~ :local(.bar) {}'
  },
  {
    should: 'convert psuedo elements that are already local using the old syntax into the new local syntax',
    input: '.local[foo]:after {}',
    expected: ':local(.foo):after {}'
  },
  {
    should: 'not reject non-global element selectors when lint mode is not enabled',
    input: 'input {}',
    expected: 'input {}'
  },
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


var errorTests = [
  {
    should: 'reject non-global element selectors',
    input: 'input {}',
    reason: 'Global selector detected in local context. Does this selector really need to be global? If so, you need to explicitly export it into the global scope with ":global", e.g. ":global input"'
  },
  {
    should: 'reject non-global element selectors in a collection',
    input: '.foo, input {}',
    reason: 'Global selector detected in local context. Does this selector really need to be global? If so, you need to explicitly export it into the global scope with ":global", e.g. ":global input"'
  },
  {
    should: 'reject non-global psuedo classes',
    input: ':focus {}',
    reason: 'Global selector detected in local context. Does this selector really need to be global? If so, you need to explicitly export it into the global scope with ":global", e.g. ":global :focus"'
  },
  {
    should: 'reject non-global psuedo classes in a collection',
    input: '.foo, :focus {}',
    reason: 'Global selector detected in local context. Does this selector really need to be global? If so, you need to explicitly export it into the global scope with ":global", e.g. ":global :focus"'
  },
  {
    should: 'reject non-global attribute selectors',
    input: '[data-foobar] {}',
    reason: 'Global selector detected in local context. Does this selector really need to be global? If so, you need to explicitly export it into the global scope with ":global", e.g. ":global [data-foobar]"'
  },
  {
    should: 'reject non-global attribute selectors in a collection',
    input: '.foo, [data-foobar] {}',
    reason: 'Global selector detected in local context. Does this selector really need to be global? If so, you need to explicitly export it into the global scope with ":global", e.g. ":global [data-foobar]"'
  }
];

function processError (css, options) {
  try {
    postcss(plugin(options)).process(css).css;
  } catch (error) {
    return error;
  }
}

test(name, function (t) {
  t.plan(errorTests.length);

  errorTests.forEach(function (test) {
    var options = { lint: true };
    var error = processError(test.input, options);
    t.equal(error.reason, test.reason, 'should ' + test.should);
  });
});


test('should use the postcss plugin api', function (t) {
    t.plan(2);
    t.ok(plugin().postcssVersion, 'should be able to access version');
    t.equal(plugin().postcssPlugin, name, 'should be able to access name');
});
