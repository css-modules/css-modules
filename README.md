<img src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150" />

# CSS Modules

A **CSS Module** is a CSS file in which all class names and animation names are scoped locally by default. All URLs (`url(...)`) and `@imports` are in module request format (`./xxx` and `../xxx` means relative, `xxx` and `xxx/yyy` means in modules folder, i. e. in `node_modules`).

``` css
/* style.css */
.className {
  color: green;
}
```

When importing the **CSS Module** from a JS Module, it exports an object with all mappings from local names to global names.

``` js
import styles from "./style.css";
// import { className } from "./style.css";

return '<div class="' + styles.className + '">';
```

## Naming

For local class names camelCase naming is recommended, but not enforced.

## Exceptions

`:global` switches to global scope for the current selector resp. identifier. `:global(.xxx)` resp. `@keyframes :global(xxx)` resp. `animation: :global(xxx);` declares a the stuff in brackets in the global scope.

Similar `:local` and `:local(...)` for local scope.

If the selector is switched into global mode, global mode is also activated for the rules.

Example: `.localA :global .global-b .global-c :local(.localD.localE) .global-d`

## Extends

It's possible to extend a selector.

``` css
.className {
  color: green;
  background: red;
}

.otherClassName {
  extends: className;
  color: yellow;
}
```

There can be multiple `extends` rules, but `extends` rules must be before other rules. Extending works only for local-scoped selectors and only if the selector is a single class name. When a class name extends from another class name, the **CSS Module** exports both class names for the local class. This can add up to multiple class names.

It's possible to extend from multiple classes with `extends: classNameA classNameB;`.

## Dependencies

It's possible to extend from class names from other **CSS Modules**.

``` css
.otherClassName {
  extends: className from "./style.css";
}
```

## Usage with preprocessors

Preprocessors can make it easy to define a block global or local.

i. e. with less.js

``` less
:global {
  .global-class-name {
    color: green;
  }
}
```

## Why?

**modular** and **reusable** CSS!

* No more conflicts.
* Explicit dependencies.
* No global scope.

## Examples

* [css-modules/webpack-demo](https://github.com/css-modules/webpack-demo);
* [Theming](examples/theming.md)

## Implementations

### webpack

Webpack's [css-loader](https://github.com/webpack/css-loader) in module mode replaces every local-scoped identifier with a global unique name (hashed from module name and local identifier by default) and exports the used identifer.

Extending adds the source class name(s) to the exports.

Extending from other modules first imports the other module and than adds the class name(s) to the exports.
