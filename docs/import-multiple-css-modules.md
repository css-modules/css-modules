<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/css-modules/css-modules/assets/9113740/f0de16c6-aee2-4fb7-8752-bf400cc5145e">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png">
  <img alt="CSS Modules Logo" src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150">
</picture>

# Import multiple css modules into a component

You can import multiple CSS Modules into a component or function using `Object.assign`.

For example, if you import a button CSS Module to your `Demo` component, add this to the components default styles.

```js
const styles = {};
import demo from './Demo.css';
import fancyButton from 'css-fancy-button';
Object.assign(styles, fancyButton, demo);
```

You can even import css modules installed from npm. e.g. [pure-css](https://github.com/StevenIseki/pure-css)

```sh
npm install pure-css --save-dev
```

Then in your component, start using pure CSS styles.

```js
import { buttons, grids } from 'pure-css';
```

A full example of a demo component with 2 css modules imported.

```jsx
import React from 'react';
const styles = {};
import demo from './Demo.css';
import fancyButton from 'css-fancy-button';
Object.assign(styles, fancyButton, demo);

export default function Demo() {
  return (
    <div className={styles.demo}>
      <button className={styles.fancyButton}>Press Me</button>
    </div>
  );
}
```
