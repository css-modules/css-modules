[![Build Status][ci-img]][ci]

# CSS Modules: Local by Default

Transforms:

```css
.foo { ... } /* => */ :local(.foo) { ... }

.foo .bar { ... } /* => */ :local(.foo) :local(.bar) { ... }

/* Shorthand global selector */

:global .foo .bar { ... } /* => */ .foo .bar { ... }

.foo :global .bar { ... } /* => */ :local(.foo) .bar { ... }

/* Targeted global selector */

:global(.foo) .bar { ... } /* => */ .foo :local(.bar) { ... }

.foo:global(.bar) { ... } /* => */ :local(.foo).bar { ... }

.foo :global(.bar) .baz { ... } /* => */ :local(.foo) .bar :local(.baz) { ... }

.foo:global(.bar) .baz { ... } /* => */ :local(.foo).bar :local(.baz) { ... }

## Development

```bash
$ npm install
$ npm test
```

## License

MIT

## With thanks

 - [Tobias Koppers](https://github.com/sokra)
 - [Glen Maddern](https://github.com/geelen)

[ci-img]: https://img.shields.io/travis/css-modules/postcss-modules-local-by-default/master.svg?style=flat-square
[ci]:     https://travis-ci.org/css-modules/postcss-modules-local-by-default
