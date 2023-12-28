<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/css-modules/css-modules/assets/9113740/f0de16c6-aee2-4fb7-8752-bf400cc5145e">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png">
  <img alt="CSS Modules Logo" src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150">
</picture>

# Pseudo class selectors

CSS Modules also support adding pseudo class selectors:

```css
/* component/text.css */
.text {
  color: #777;
  font-weight: 24px;
}

.text:hover {
  color: #f60;
}
```

```js
/* component/text.js */
import styles from './text.css';
import React from 'react';

export function Text() {
  return <p className={styles.text}>Text with hover</p>;
}
```
