###Import multiple css modules into a component

You can import multiple css modules into a component or function using `Object.assign`
For example if you import a button css modules to your Demo component, add this to the components default styles.

```js
let styles = {}
import demo from './Demo.css'
import fancyButton from 'css-fancy-button'
Object.assign(styles, fancyButton, demo)
```

You can even import css modules installed from npm. e.g. [pure-css](https://github.com/StevenIseki/pure-css)

```sh
npm install pure-css --save-dev
```

Then in your component... start using pure css styles.

```js
import { buttons, grids } from 'pure-css'
```

A full example of a demo component with 2 css modules imported.

```jsx
import React from 'react'
let styles = {}
import demo from './Demo.css'
import fancyButton from 'css-fancy-button'
Object.assign(styles, fancyButton, demo)

function Demo( props) {

    const { route } = props;

    return (
    	<div className={styles.demo}>
    		<button className={styles.fancyButton}>press me</button>
       	</div>
    );
}

export default Demo
```