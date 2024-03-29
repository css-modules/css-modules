<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/css-modules/css-modules/assets/9113740/f0de16c6-aee2-4fb7-8752-bf400cc5145e">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png">
  <img alt="CSS Modules Logo" src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150">
</picture>

# History

- 04/2015: `placeholders` feature in css-loader (webpack) allows local scoped selectors (later renamed to `local scope`) by @sokra
- 05/2015: `postcss-local-scope` enables `local scope` by default (see [blog post](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284)) by @markdalgleish
- 05/2015: `extends` feature in css-loader allow to compose local or imported class names by @sokra
- 05/2015: First CSS Modules spec document and github organization with @sokra, @markdalgleish and @geelen
- 06/2015: `extends` renamed to `composes`
- 06/2015: PostCSS transformations to transform CSS Modules into an intermediate format (ICSS)
- 06/2015: Spec for ICSS as common implementation format for multiple module systems by @geelen
- 06/2015: Implementation for jspm by @geelen and @guybedford
- 06/2015: Implementation for browserify by @joshwnj, @joshgillies and @markdalgleish
- 06/2015: webpack's css-loader implementation updated to latest spec by @sokra
