<img src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150" />

# CSS Modules — Local Scope

The first and most fundamental feature of CSS Modules is that class selectors, by default, are **local**. So, if you write:

```css
.backdrop {}
.prompt {}
.pullquote {}
```

the classes `backdrop`, `field` & `pullquote` are *local to that file*. That means they don't pollute the global namespace, so you're free to use any name you like. You compile them by importing or requiring them in your JS file. These examples will be using React syntax, but of course it's not tied to React in any particular way.

```js
import styles from "./style.css"

const Component = props => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.prompt}>
      </div>
      <div className={styles.pullquote}>
      </div>
   </div>
  )
}
```
