<img src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150" />

# Setting up CSS Modules

CSS Modules works by compiling individual CSS files into both CSS and data. The CSS output is normal, global CSS, which can be injected directly into the browser or concatenated together and written to a file for production use. The data is used to map the human-readable names you've used in the files to the globally-safe output CSS.

## Tools

### Bun

Bun supports CSS Modules. [Learn more](https://bun.sh/docs/bundler).

### Lightning CSS

Lightning CSS supports almost all features of CSS Modules. [Learn more](https://lightningcss.dev/css-modules.html).

### Parcel

Parcel supports CSS Modules. [Learn more](https://parceljs.org/languages/css/#css-modules).

### PostCSS

PostCSS supports CSS Modules through the plugin `postcss-modules`. [Learn more](https://www.npmjs.com/package/postcss-modules).

### Rspack

Rspack supports CSS Modules. [Learn more](https://www.rspack.dev/guide/language-support#css-modules).

### Webpack

The [css-loader](https://github.com/webpack/css-loader) has CSS Modules built-in. Simply activate it by using the `?modules` flag. We maintain an example project using this at [css-modules/webpack-demo](https://css-modules.github.io/webpack-demo/).

### Vite

Vite supports CSS Modules through Lightning CSS. [Learn more](https://vitejs.dev/guide/features#css-modules).

## Frameworks

### Angular

Angular supports CSS Modules through `postcss-modules` and `posthtml-css-modules`. [Learn more](https://angularindepth.com/posts/1294/angular-css-modules).

### Astro

Astro supports CSS Modules. [Learn more](https://docs.astro.build/en/guides/styling/).

### Create React App

Create React App supports CSS Modules. [Learn more](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/).

### Next.js

Next.js supports CSS Modules for both webpack and Turbopack (`next dev --turbo`). [Learn more](https://nextjs.org/docs/app/building-your-application/styling/css-modules).

### Nuxt

Solid supports CSS Modules. [Learn more](https://nuxt.com/docs/getting-started/styling#css-modules).

### Remix

Remix supports CSS Modules. [Learn more](https://remix.run/docs/en/main/styling/css-modules).

### Solid

Solid supports CSS Modules. [Learn more](https://docs.solidjs.com/guides/how-to-guides/styling-in-solid/css-modules).

### Svelte

Svelte supports CSS Modules through the preprocessor `svelte-preprocess-cssmodules`. [Learn more](https://github.com/micantoine/svelte-preprocess-cssmodules).
