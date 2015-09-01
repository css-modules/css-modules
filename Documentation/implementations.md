
## Implementations

### webpack

Webpack's [css-loader](https://github.com/webpack/css-loader) in module mode replaces every local-scoped identifier with a global unique name (hashed from module name and local identifier by default) and exports the used identifer.

Extending adds the source class name(s) to the exports.

Extending from other modules first imports the other module and than adds the class name(s) to the exports.


### browserify

Browserify's (css-modulesify)[https://github.com/css-modules/css-modulesify].
