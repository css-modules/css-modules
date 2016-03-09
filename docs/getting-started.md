<img src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150" />

# Setting up CSS Modules

CSS Modules works by compiling individual CSS files into both CSS and data. The CSS output is normal, global CSS, which can be injected directly into the browser or concatenated together and written to a file for production use. The data is used to map the human-readable names you've used in the files to the globally-safe output CSS.

There are currently 4 ways to integrate CSS Modules into your project. You should look to each of these projects for more detailed setup instructions. 

### Webpack

The [css-loader](https://github.com/webpack/css-loader) has CSS Modules built-in. Simply activate it by using the `?modules` flag. We maintain an example project using this at [css-modules/webpack-demo](https://github.com/css-modules/webpack-demo).

### Browserify

The plugin [css-modulesify](https://github.com/css-modules/css-modulesify) gives your Browserify build the ability to `require` a CSS file and compile it as a CSS Module. For an example project using this setup, check out [css-modules/browserify-demo](https://github.com/css-modules/browserify-demo).

### JSPM

The experimental JSPM loader [jspm-loader-css-modules](https://github.com/geelen/jspm-loader-css-modules) adds CSS Modules support to SystemJS & JSPM. There's a simple project using this at [css-modules/jspm-demo](https://github.com/css-modules/jspm-demo).
 
### NodeJS

The [css-modules-require-hook](https://github.com/css-modules/css-modules-require-hook) works similarly to the Browserify plugin, but patches NodeJS's `require` to interpret CSS files as CSS Modules. This gives complete flexibility in how the output is handled, ideal for server-side rendering.

## Language integrations

### React

If you're using React, CSS Modules is a great fit. [react-css-modules](https://github.com/gajus/react-css-modules) adds a `CSSModules` higher-order component or `@CSSModules` annotation for better integrating CSS Modules & React.

### Deku

If you're using Deku, CSS Modules is an awesome fit. [deku-css-modules](https://github.com/StevenIseki/deku-css-modules) allows for easy integration of CSS Modules & Deku.
