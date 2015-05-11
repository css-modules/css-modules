[![Build Status][ci-img]][ci]

# PostCSS Local Scope

*WARNING: This plugin is still a work in progress and not yet ready for production.*

[PostCSS] plugin to transform global selectors into the [local scope] format of [Webpack]'s [css-loader].

[PostCSS]:     https://github.com/postcss/postcss
[ci-img]:      https://img.shields.io/travis/markdalgleish/postcss-local-scope/master.svg?style=flat-square
[ci]:          https://travis-ci.org/markdalgleish/postcss-local-scope
[Webpack]:     http://webpack.github.io
[css-loader]:  https://github.com/webpack/css-loader
[local scope]: https://github.com/webpack/css-loader#local-scope

```css
.foo { /* ... */ }

.global[selector=".some .global .selector"] { /* ... */ }
```

```css
.local[foo] { /* ... */ }

.some .global .selector { /* ... */ }
```

## Usage

```js
postcss([ require('postcss-local-scope') ])
```

See [PostCSS] docs for examples for your environment.
