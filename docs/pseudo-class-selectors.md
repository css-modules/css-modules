<img src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150" />

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
