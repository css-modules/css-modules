<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/css-modules/css-modules/assets/9113740/f0de16c6-aee2-4fb7-8752-bf400cc5145e">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png">
  <img alt="CSS Modules Logo" src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150">
</picture>

# CSS Modules

A **CSS Module** is a CSS file where all class names and animation names are scoped locally by default. All URLs (`url(...)`) and `@imports` are in module request format (`./xxx` and `../xxx` means relative, `xxx` and `xxx/yyy` means in modules folder, i.e. in `node_modules`).

CSS Modules compile to a low-level interchange format called ICSS (or [Interoperable CSS](https://github.com/css-modules/icss)) but are written like normal CSS files:

```css
/* style.css */
.className {
  color: green;
}
```

When importing a **CSS Module** from a JavaScript Module, it exports an object with all mappings from local names to global names.

```js
import styles from './style.css';

element.innerHTML = '<div class="' + styles.className + '">';
```

## Table of Contents

- [Get Started & Examples](/docs/get-started.md)
- [Naming](/docs/naming.md)
- [Composition](/docs/composition.md)
- [Local Scope](/docs/local-scope.md)
- [History](/docs/history.md)
- [Pseudo Class Selectors](/docs/pseudo-class-selectors.md)
- [Theming](/docs/theming.md)

## Why CSS Modules?

- **Local Scope Prevents Clashes:** CSS Modules use local scope to avoid style conflicts across different project parts, allowing component-scoped styling.
- **Clear Style Dependencies:** Importing styles into their respective components clarifies which styles impact which areas, enhancing code readability and maintenance.
- **Solves Global Scope Problems:** CSS Modules prevent the common issue of styles in one file affecting the entire project by localizing styles to specific components.
- **Boosts Reusability and Modularity:** CSS Modules allow the same class names in different modules, promoting modular, reusable styling.
