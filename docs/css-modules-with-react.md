<img src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150" />

# CSS Modules with React

**Demo.js**

```jsx
import React from 'react'
import CSSModules from 'react-css-modules'
/* import your css modules styles for the component */
import styles from './Demo.css' 

function Demo( props) {

    const { route } = props

    return (
    	<div styleName='demo'>
    		<button styleName='button blue'>press me</button>
       	</div>
    )
}

export default CSSModules(Demo, styles, {allowMultiple: true} )
```

**index.js**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import Demo from './components/Demo'

function App(props) {
    return (
        <main>
            <Demo />
        </main>        
    )
}

ReactDOM.render(React.createElement(App), document.getElementById('root'))
```
