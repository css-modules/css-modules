### exporting values variables

You can export values with css modules similar to using variables in less or sass.

Just ensure you are using postcss and the [postcss-modules-values](https://github.com/css-modules/postcss-modules-values) plugin

Now you set up your values/variables

**colors.css**

```css
@value blue: #0c77f8;
@value red: #ff0000;
@value green: #aaf200;
```

then import them into your components css module

**demo.css**

```css
/* import your colors... */
@value colors: "./colors.css";
@value blue, red, green from colors;

.button {
  color: blue;
  display: inline-block;
}
```

## example webpack.config for postcss-modules-values

```js
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var values = require('postcss-modules-values');

module.exports = {
  entry: ['./src/index'],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public'),
    publicPath: '/public/'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader') }
    ]
  },
  postcss: [ 
    values 
  ],
  plugins: [
    new ExtractTextPlugin('style.css', { allChunks: true })
  ]

};
```
