<img src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150" />

# CSS Modules — Local Scope

CSS Modules have class selectors scoped locally by default. For example, the following classes `backdrop`, `prompt` & `pullquote` are _local to that file_.

```css
.backdrop {
}
.prompt {
}
.pullquote {
}
```

They do not pollute the global namespace, so you're free to use any name you like. You compile them by importing or requiring them in your JavaScript file.

```js
import styles from './style.css';

export function Component(props) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.prompt} />
      <div className={styles.pullquote} />
    </div>
  );
}
```

> **Note:** These examples use React syntax, but of course it's not tied to React in any particular way.
