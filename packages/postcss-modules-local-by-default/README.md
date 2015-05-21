[![Build Status][ci-img]][ci] [![npm][npm-img]][npm]

# PostCSS Local Scope

[PostCSS] plugin to transform global selectors into the [local scope] format of [Webpack]'s [css-loader].

**WARNING: This project depends on [css-loader]'s [local scope] feature, which is marked as experimental and is very likely to change in the future. Always ensure you're using the latest version of both [css-loader] and postcss-local-scope together.**

## Why?

Everyone agrees that dumping JavaScript in the global scope is a terrible idea. Why is CSS any different?

Imagine if we could import the CSS that a component needs without leaking selectors into the global scope. We wouldn't need naming conventions like [BEM] to avoid naming collisions, and we could prevent accidental coupling between components by ensuring our CSS follows the same scoping rules as any JavaScript module.

Webpack allows [local scope] in CSS with [css-loader], but it's opt-in via a special `:local(.identifier)` syntax.

This plugin transforms standard class selectors into local identifiers so that [local scope] is the default and global styles are the exception, just like any sane module system.

## Usage example

Local identifiers use standard class syntax:

```css
.foo { /* ... */ }

.foo .bar { /* ... */ }
```

Any global selectors need to be explicitly prefixed:

```css
:global(.global .selector) { /* ... */ }

:global .another .global .selector { /* ... */ }
```

Local and global selectors can also be used simultaneously:

```css
.foo :global .global { /* ... */ }

.foo :global(.global) .bar { /* ... */ }
```

These selectors are then transformed into a format that [css-loader] understands. To use these scoped classes, [Webpack] now allows us to import them like any other module.

For example, when using [React]:

```js
import styles from './MyComponent.css';

import React from 'react';

export default class MyComponent extends React.Component {
  render() {
    return (
      <div className={styles.foo}>
        <div className={styles.bar}>
          Local scope!
        </div>
      </div>
    );
  }
};
```

In this case, `styles` is an object that maps identifiers to classes.

Classes are dynamically generated at build time by [css-loader], so components are unable to depend on classes that they haven't explicitly imported.

## Show me a working example

[Okay.](https://github.com/markdalgleish/postcss-local-scope-example)

## Transformation examples

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
```

[PostCSS]:     https://github.com/postcss/postcss
[ci-img]:      https://img.shields.io/travis/markdalgleish/postcss-local-scope/master.svg?style=flat-square
[ci]:          https://travis-ci.org/markdalgleish/postcss-local-scope
[npm-img]:     https://img.shields.io/npm/v/postcss-local-scope.svg?style=flat-square
[npm]:         https://www.npmjs.com/package/postcss-local-scope
[Webpack]:     http://webpack.github.io
[css-loader]:  https://github.com/webpack/css-loader
[local scope]: https://github.com/webpack/css-loader#local-scope
[BEM]:         https://css-tricks.com/bem-101
[React]:       http://facebook.github.io/react
