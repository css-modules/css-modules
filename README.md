<img src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150" />

# CSS Modules

A **CSS Module** is a CSS file in which all class names and animation names are scoped locally by default. All URLs (`url(...)`) and `@imports` are in module request format (`./xxx` and `../xxx` means relative, `xxx` and `xxx/yyy` means in modules folder, i. e. in `node_modules`).

CSS Modules compile to a low-level interchange format called ICSS or [Interoperable CSS](https://github.com/css-modules/icss), but are written like normal CSS files:

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

element.innerHTML = '<div class="' + styles.className + '">';
```

## Why?

**modular** and **reusable** CSS!

* No more conflicts.
* Explicit dependencies.
* No global scope.

## Documentation
+ [Composition](Documentation/Composition.md)
+ [Exceptions](Documentation/Exceptions.md)
+ [Implementations](Documentation/Implementations.md)
+ [Preprocessors](Documentation/Preprocessors.md)
+ [History](Documentation/history.md)

## Examples
* [css-modules/webpack-demo](https://github.com/css-modules/webpack-demo)
* [Theming](examples/theming.md)
