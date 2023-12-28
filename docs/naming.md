<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/css-modules/css-modules/assets/9113740/f0de16c6-aee2-4fb7-8752-bf400cc5145e">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png">
  <img alt="CSS Modules Logo" src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150">
</picture>

# Naming

We recommend camelCase for local class names.

While not enforced, camelCase is preferred as kebab-case may cause unexpected behavior when trying to access `styles.class-name` with dot notation. You can still work around kebab-case with bracket notation (e.g. `styles['class-name']`) but `styles.className` is preferred.
