'use strict';

const postcss = require('postcss');
const plugin = require('../');
const name = require('../package.json').name;

const tests = [
  [
    'scope selectors',
    {
      input: '.foobar {}',
      expected: ':local(.foobar) {}',
    },
  ],
  [
    'scope escaped selectors',
    {
      input: '.\\3A \\) {}',
      expected: ':local(.\\3A \\)) {}',
    },
  ],
  [
    'scope ids',
    {
      input: '#foobar {}',
      expected: ':local(#foobar) {}',
    },
  ],
  [
    'scope escaped ids',
    {
      input: '#\\#test {}',
      expected: ':local(#\\#test) {}',
    },
  ],
  [
    'scope escaped ids (2)',
    {
      input: '#u-m\\00002b {}',
      expected: ':local(#u-m\\00002b) {}',
    },
  ],
  [
    'scope multiple selectors',
    {
      input: '.foo, .baz {}',
      expected: ':local(.foo), :local(.baz) {}',
    },
  ],
  [
    'scope sibling selectors',
    {
      input: '.foo ~ .baz {}',
      expected: ':local(.foo) ~ :local(.baz) {}',
    },
  ],
  [
    'scope psuedo elements',
    {
      input: '.foo:after {}',
      expected: ':local(.foo):after {}',
    },
  ],
  [
    'scope media queries',
    {
      input: '@media only screen { .foo {} }',
      expected: '@media only screen { :local(.foo) {} }',
    },
  ],
  [
    'allow narrow global selectors',
    {
      input: ':global(.foo .bar) {}',
      expected: '.foo .bar {}',
    },
  ],
  [
    'allow narrow local selectors',
    {
      input: ':local(.foo .bar) {}',
      expected: ':local(.foo) :local(.bar) {}',
    },
  ],
  [
    'allow broad global selectors',
    {
      input: ':global .foo .bar {}',
      expected: '.foo .bar {}',
    },
  ],
  [
    'allow broad local selectors',
    {
      input: ':local .foo .bar {}',
      expected: ':local(.foo) :local(.bar) {}',
    },
  ],
  [
    'allow multiple narrow global selectors',
    {
      input: ':global(.foo), :global(.bar) {}',
      expected: '.foo, .bar {}',
    },
  ],
  [
    'allow multiple broad global selectors',
    {
      input: ':global .foo, :global .bar {}',
      expected: '.foo, .bar {}',
    },
  ],
  [
    'allow multiple broad local selectors',
    {
      input: ':local .foo, :local .bar {}',
      expected: ':local(.foo), :local(.bar) {}',
    },
  ],
  [
    'allow narrow global selectors nested inside local styles',
    {
      input: '.foo :global(.foo .bar) {}',
      expected: ':local(.foo) .foo .bar {}',
    },
  ],
  [
    'allow broad global selectors nested inside local styles',
    {
      input: '.foo :global .foo .bar {}',
      expected: ':local(.foo) .foo .bar {}',
    },
  ],
  [
    'allow parentheses inside narrow global selectors',
    {
      input: '.foo :global(.foo:not(.bar)) {}',
      expected: ':local(.foo) .foo:not(.bar) {}',
    },
  ],
  [
    'allow parentheses inside narrow local selectors',
    {
      input: '.foo :local(.foo:not(.bar)) {}',
      expected: ':local(.foo) :local(.foo):not(:local(.bar)) {}',
    },
  ],
  [
    'allow narrow global selectors appended to local styles',
    {
      input: '.foo:global(.foo.bar) {}',
      expected: ':local(.foo).foo.bar {}',
    },
  ],
  [
    'ignore selectors that are already local',
    {
      input: ':local(.foobar) {}',
      expected: ':local(.foobar) {}',
    },
  ],
  [
    'ignore nested selectors that are already local',
    {
      input: ':local(.foo) :local(.bar) {}',
      expected: ':local(.foo) :local(.bar) {}',
    },
  ],
  [
    'ignore multiple selectors that are already local',
    {
      input: ':local(.foo), :local(.bar) {}',
      expected: ':local(.foo), :local(.bar) {}',
    },
  ],
  [
    'ignore sibling selectors that are already local',
    {
      input: ':local(.foo) ~ :local(.bar) {}',
      expected: ':local(.foo) ~ :local(.bar) {}',
    },
  ],
  [
    'ignore psuedo elements that are already local',
    {
      input: ':local(.foo):after {}',
      expected: ':local(.foo):after {}',
    },
  ],
  [
    'trim whitespace after empty broad selector',
    {
      input: '.bar :global :global {}',
      expected: ':local(.bar) {}',
    },
  ],
  [
    'broad global should be limited to selector',
    {
      input: ':global .foo, .bar :global, .foobar :global {}',
      expected: '.foo, :local(.bar), :local(.foobar) {}',
    },
  ],
  [
    'broad global should be limited to nested selector',
    {
      input: '.foo:not(:global .bar).foobar {}',
      expected: ':local(.foo):not(.bar):local(.foobar) {}',
    },
  ],
  [
    'broad global and local should allow switching',
    {
      input: '.foo :global .bar :local .foobar :local .barfoo {}',
      expected: ':local(.foo) .bar :local(.foobar) :local(.barfoo) {}',
    },
  ],
  [
    'localize a single animation-name',
    {
      input: '.foo { animation-name: bar; }',
      expected: ':local(.foo) { animation-name: :local(bar); }',
    },
  ],
  [
    'not localize a single animation-delay',
    {
      input: '.foo { animation-delay: 1s; }',
      expected: ':local(.foo) { animation-delay: 1s; }',
    },
  ],
  [
    'localize multiple animation-names',
    {
      input: '.foo { animation-name: bar, foobar; }',
      expected: ':local(.foo) { animation-name: :local(bar), :local(foobar); }',
    },
  ],
  [
    'localize animation',
    {
      input: '.foo { animation: bar 5s, foobar; }',
      expected: ':local(.foo) { animation: :local(bar) 5s, :local(foobar); }',
    },
  ],
  [
    'localize animation with vendor prefix',
    {
      input: '.foo { -webkit-animation: bar; animation: bar; }',
      expected:
        ':local(.foo) { -webkit-animation: :local(bar); animation: :local(bar); }',
    },
  ],
  [
    'not localize other rules',
    {
      input: '.foo { content: "animation: bar;" }',
      expected: ':local(.foo) { content: "animation: bar;" }',
    },
  ],
  [
    'not localize global rules',
    {
      input: ':global .foo { animation: foo; animation-name: bar; }',
      expected: '.foo { animation: foo; animation-name: bar; }',
    },
  ],
  [
    'handle a complex animation rule',
    {
      input:
        '.foo { animation: foo, bar 5s linear 2s infinite alternate, barfoo 1s; }',
      expected:
        ':local(.foo) { animation: :local(foo), :local(bar) 5s linear 2s infinite alternate, :local(barfoo) 1s; }',
    },
  ],
  [
    'handle animations where the first value is not the animation name',
    {
      input: '.foo { animation: 1s foo; }',
      expected: ':local(.foo) { animation: 1s :local(foo); }',
    },
  ],
  [
    'handle animations where the first value is not the animation name whilst also using keywords',
    {
      input: '.foo { animation: 1s normal ease-out infinite foo; }',
      expected:
        ':local(.foo) { animation: 1s normal ease-out infinite :local(foo); }',
    },
  ],
  [
    'not treat animation curve as identifier of animation name even if it separated by comma',
    {
      input:
        '.foo { animation: slide-right 300ms forwards ease-out, fade-in 300ms forwards ease-out; }',
      expected:
        ':local(.foo) { animation: :local(slide-right) 300ms forwards ease-out, :local(fade-in) 300ms forwards ease-out; }',
    },
  ],
  [
    'not treat "start" and "end" keywords in steps() function as identifiers',
    {
      input: [
        '.foo { animation: spin 1s steps(12, end) infinite; }',
        '.foo { animation: spin 1s STEPS(12, start) infinite; }',
        '.foo { animation: spin 1s steps(12, END) infinite; }',
        '.foo { animation: spin 1s steps(12, START) infinite; }',
      ].join('\n'),
      expected: [
        ':local(.foo) { animation: :local(spin) 1s steps(12, end) infinite; }',
        ':local(.foo) { animation: :local(spin) 1s STEPS(12, start) infinite; }',
        ':local(.foo) { animation: :local(spin) 1s steps(12, END) infinite; }',
        ':local(.foo) { animation: :local(spin) 1s steps(12, START) infinite; }',
      ].join('\n'),
    },
  ],
  [
    'handle animations with custom timing functions',
    {
      input:
        '.foo { animation: 1s normal cubic-bezier(0.25, 0.5, 0.5. 0.75) foo; }',
      expected:
        ':local(.foo) { animation: 1s normal cubic-bezier(0.25, 0.5, 0.5. 0.75) :local(foo); }',
    },
  ],
  [
    'handle animations whose names are keywords',
    {
      input: '.foo { animation: 1s infinite infinite; }',
      expected: ':local(.foo) { animation: 1s infinite :local(infinite); }',
    },
  ],
  [
    'handle not localize an animation shorthand value of "inherit"',
    {
      input: '.foo { animation: inherit; }',
      expected: ':local(.foo) { animation: inherit; }',
    },
  ],
  [
    'handle "constructor" as animation name',
    {
      input: '.foo { animation: constructor constructor; }',
      expected:
        ':local(.foo) { animation: :local(constructor) :local(constructor); }',
    },
  ],
  [
    'default to global when mode provided',
    {
      input: '.foo {}',
      options: { mode: 'global' },
      expected: '.foo {}',
    },
  ],
  [
    'default to local when mode provided',
    {
      input: '.foo {}',
      options: { mode: 'local' },
      expected: ':local(.foo) {}',
    },
  ],
  [
    'use correct spacing',
    {
      input: [
        '.a :local .b {}',
        '.a:local.b {}',
        '.a:local(.b) {}',
        '.a:local( .b ) {}',
        '.a :local(.b) {}',
        '.a :local( .b ) {}',
        ':local(.a).b {}',
        ':local( .a ).b {}',
        ':local(.a) .b {}',
        ':local( .a ) .b {}',
      ].join('\n'),
      options: { mode: 'global' },
      expected: [
        '.a :local(.b) {}',
        '.a:local(.b) {}',
        '.a:local(.b) {}',
        '.a:local(.b) {}',
        '.a :local(.b) {}',
        '.a :local(.b) {}',
        ':local(.a).b {}',
        ':local(.a).b {}',
        ':local(.a) .b {}',
        ':local(.a) .b {}',
      ].join('\n'),
    },
  ],
  [
    'localize keyframes',
    {
      input: '@keyframes foo { from { color: red; } to { color: blue; } }',
      expected:
        '@keyframes :local(foo) { from { color: red; } to { color: blue; } }',
    },
  ],
  [
    'localize keyframes in global default mode',
    {
      input: '@keyframes foo {}',
      options: { mode: 'global' },
      expected: '@keyframes foo {}',
    },
  ],
  [
    'localize explicit keyframes',
    {
      input:
        '@keyframes :local(foo) { 0% { color: red; } 33.3% { color: yellow; } 100% { color: blue; } } @-webkit-keyframes :global(bar) { from { color: red; } to { color: blue; } }',
      expected:
        '@keyframes :local(foo) { 0% { color: red; } 33.3% { color: yellow; } 100% { color: blue; } } @-webkit-keyframes bar { from { color: red; } to { color: blue; } }',
    },
  ],
  [
    'ignore :export statements',
    {
      input: ':export { foo: __foo; }',
      expected: ':export { foo: __foo; }',
    },
  ],
  [
    'ignore :import statemtents',
    {
      input: ':import("~/lol.css") { foo: __foo; }',
      expected: ':import("~/lol.css") { foo: __foo; }',
    },
  ],
  [
    'incorrectly handle nested selectors',
    {
      input: '.bar:not(:global .foo, .baz) {}',
      expected: ':local(.bar):not(.foo, .baz) {}',
    },
  ],
  [
    'compile in pure mode',
    {
      input: ':global(.foo).bar, [type="radio"] ~ .label, :not(.foo), #bar {}',
      options: { mode: 'pure' },
      expected:
        '.foo:local(.bar), [type="radio"] ~ :local(.label), :not(:local(.foo)), :local(#bar) {}',
    },
  ],
  [
    'compile explict global element',
    {
      input: ':global(input) {}',
      expected: 'input {}',
    },
  ],
  [
    'compile explict global attribute',
    {
      input: ':global([type="radio"]), :not(:global [type="radio"]) {}',
      expected: '[type="radio"], :not([type="radio"]) {}',
    },
  ],
  [
    'throw on invalid mode',
    {
      input: '',
      options: { mode: '???' },
      error: /"global", "local" or "pure"/,
    },
  ],
  [
    'throw on inconsistent selector result',
    {
      input: ':global .foo, .bar {}',
      error: /Inconsistent/,
    },
  ],
  [
    'throw on nested :locals',
    {
      input: ':local(:local(.foo)) {}',
      error: /is not allowed inside/,
    },
  ],
  [
    'throw on nested :globals',
    {
      input: ':global(:global(.foo)) {}',
      error: /is not allowed inside/,
    },
  ],
  [
    'throw on nested mixed',
    {
      input: ':local(:global(.foo)) {}',
      error: /is not allowed inside/,
    },
  ],
  [
    'throw on nested broad :local',
    {
      input: ':global(:local .foo) {}',
      error: /is not allowed inside/,
    },
  ],
  [
    'throw on incorrect spacing with broad :global',
    {
      input: '.foo :global.bar {}',
      error: /Missing whitespace after :global/,
    },
  ],
  [
    'throw on incorrect spacing with broad :local',
    {
      input: '.foo:local .bar {}',
      error: /Missing whitespace before :local/,
    },
  ],
  [
    'throw on not pure selector (global class)',
    {
      input: ':global(.foo) {}',
      options: { mode: 'pure' },
      error: /":global\(\.foo\)" is not pure/,
    },
  ],
  [
    'throw on not pure selector (with multiple 1)',
    {
      input: '.foo, :global(.bar) {}',
      options: { mode: 'pure' },
      error: /".foo, :global\(\.bar\)" is not pure/,
    },
  ],
  [
    'throw on not pure selector (with multiple 2)',
    {
      input: ':global(.bar), .foo {}',
      options: { mode: 'pure' },
      error: /":global\(\.bar\), .foo" is not pure/,
    },
  ],
  [
    'throw on not pure selector (element)',
    {
      input: 'input {}',
      options: { mode: 'pure' },
      error: /"input" is not pure/,
    },
  ],
  [
    'throw on not pure selector (attribute)',
    {
      input: '[type="radio"] {}',
      options: { mode: 'pure' },
      error: /"\[type="radio"\]" is not pure/,
    },
  ],
  [
    'throw on not pure keyframes',
    {
      input: '@keyframes :global(foo) {}',
      options: { mode: 'pure' },
      error: /@keyframes :global\(\.\.\.\) is not allowed in pure mode/,
    },
  ],
  [
    'pass through global element',
    {
      input: 'input {}',
      expected: 'input {}',
    },
  ],
  [
    'localise class and pass through element',
    {
      input: '.foo input {}',
      expected: ':local(.foo) input {}',
    },
  ],
  [
    'pass through attribute selector',
    {
      input: '[type="radio"] {}',
      expected: '[type="radio"] {}',
    },
  ],
  [
    'not modify urls without option',
    {
      input:
        '.a { background: url(./image.png); }\n' +
        ':global .b { background: url(image.png); }\n' +
        '.c { background: url("./image.png"); }',
      expected:
        ':local(.a) { background: url(./image.png); }\n' +
        '.b { background: url(image.png); }\n' +
        ':local(.c) { background: url("./image.png"); }',
    },
  ],
  [
    'rewrite url in local block',
    {
      input:
        '.a { background: url(./image.png); }\n' +
        ':global .b { background: url(image.png); }\n' +
        '.c { background: url("./image.png"); }\n' +
        ".c { background: url('./image.png'); }\n" +
        '.d { background: -webkit-image-set(url("./image.png") 1x, url("./image2x.png") 2x); }\n' +
        '@font-face { src: url("./font.woff"); }\n' +
        '@-webkit-font-face { src: url("./font.woff"); }\n' +
        '@media screen { .a { src: url("./image.png"); } }\n' +
        '@keyframes :global(ani1) { 0% { src: url("image.png"); } }\n' +
        '@keyframes ani2 { 0% { src: url("./image.png"); } }\n' +
        'foo { background: end-with-url(something); }',
      options: {
        rewriteUrl: function(global, url) {
          const mode = global ? 'global' : 'local';
          return '(' + mode + ')' + url + '"' + mode + '"';
        },
      },
      expected:
        ':local(.a) { background: url((local\\)./image.png\\"local\\"); }\n' +
        '.b { background: url((global\\)image.png\\"global\\"); }\n' +
        ':local(.c) { background: url("(local)./image.png\\"local\\""); }\n' +
        ':local(.c) { background: url(\'(local)./image.png"local"\'); }\n' +
        ':local(.d) { background: -webkit-image-set(url("(local)./image.png\\"local\\"") 1x, url("(local)./image2x.png\\"local\\"") 2x); }\n' +
        '@font-face { src: url("(local)./font.woff\\"local\\""); }\n' +
        '@-webkit-font-face { src: url("(local)./font.woff\\"local\\""); }\n' +
        '@media screen { :local(.a) { src: url("(local)./image.png\\"local\\""); } }\n' +
        '@keyframes ani1 { 0% { src: url("(global)image.png\\"global\\""); } }\n' +
        '@keyframes :local(ani2) { 0% { src: url("(local)./image.png\\"local\\""); } }\n' +
        'foo { background: end-with-url(something); }',
    },
  ],
  [
    'not crash on atrule without nodes',
    {
      input: '@charset "utf-8";',
      expected: '@charset "utf-8";',
    },
  ],
  [
    'not crash on a rule without nodes',
    {
      input: (function() {
        const inner = postcss.rule({ selector: '.b', ruleWithoutBody: true });
        const outer = postcss.rule({ selector: '.a' }).push(inner);
        const root = postcss.root().push(outer);
        inner.nodes = undefined;
        return root;
      })(),
      // postcss-less's stringify would honor `ruleWithoutBody` and omit the trailing `{}`
      expected: ':local(.a) {\n    :local(.b) {}\n}',
    },
  ],
  [
    'not break unicode characters',
    {
      input: '.a { content: "\\2193" }',
      expected: ':local(.a) { content: "\\2193" }',
    },
  ],
  [
    'not break unicode characters',
    {
      input: '.a { content: "\\2193\\2193" }',
      expected: ':local(.a) { content: "\\2193\\2193" }',
    },
  ],
  [
    'not break unicode characters',
    {
      input: '.a { content: "\\2193 \\2193" }',
      expected: ':local(.a) { content: "\\2193 \\2193" }',
    },
  ],
  [
    'not break unicode characters',
    {
      input: '.a { content: "\\2193\\2193\\2193" }',
      expected: ':local(.a) { content: "\\2193\\2193\\2193" }',
    },
  ],
  [
    'not break unicode characters',
    {
      input: '.a { content: "\\2193 \\2193 \\2193" }',
      expected: ':local(.a) { content: "\\2193 \\2193 \\2193" }',
    },
  ],
  [
    'not ignore custom property set',
    {
      input:
        ':root { --title-align: center; --sr-only: { position: absolute; } }',
      expected:
        ':root { --title-align: center; --sr-only: { position: absolute; } }',
    },
  ],
  /**
   * Imported aliases
   */
  [
    'not localize imported alias',
    {
      input: `
      :import(foo) { a_value: some-value; }

      .foo > .a_value { }
    `,
      expected: `
      :import(foo) { a_value: some-value; }

      :local(.foo) > .a_value { }
    `,
    },
  ],
  [
    'not localize nested imported alias',
    {
      input: `
      :import(foo) { a_value: some-value; }

      .foo > .a_value > .bar { }
    `,
      expected: `
      :import(foo) { a_value: some-value; }

      :local(.foo) > .a_value > :local(.bar) { }
    `,
    },
  ],
  [
    'ignore imported in explicit local',
    {
      input: `
      :import(foo) { a_value: some-value; }

      :local(.a_value) { }
    `,
      expected: `
      :import(foo) { a_value: some-value; }

      :local(.a_value) { }
    `,
    },
  ],
  [
    'escape local context with explict global',
    {
      input: `
      :import(foo) { a_value: some-value; }

      :local .foo :global(.a_value) .bar { }
    `,
      expected: `
      :import(foo) { a_value: some-value; }

      :local(.foo) .a_value :local(.bar) { }
    `,
    },
  ],
  [
    'respect explicit local',
    {
      input: `
      :import(foo) { a_value: some-value; }

      .a_value :local .a_value .foo :global .a_value { }
    `,
      expected: `
      :import(foo) { a_value: some-value; }

      .a_value :local(.a_value) :local(.foo) .a_value { }
    `,
    },
  ],
  [
    'not localize imported animation-name',
    {
      input: `
      :import(file) { a_value: some-value; }

      .foo { animation-name: a_value; }
    `,
      expected: `
      :import(file) { a_value: some-value; }

      :local(.foo) { animation-name: a_value; }
    `,
    },
  ],
];

function process(css, options) {
  return postcss(plugin(options)).process(css).css;
}

test.each(tests)('should %s.', (name, { input, expected, error, options }) => {
  if (error) {
    expect(() => process(input, options)).toThrow(error);
  } else {
    expect(process(input, options)).toEqual(expected);
  }
});

test('should use the postcss plugin api', () => {
  expect(plugin().postcssVersion).toBeDefined();
  expect(plugin().postcssPlugin).toEqual(name);
});
