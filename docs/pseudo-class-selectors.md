### Pseudo class selectors
Because css modules works by adding classes to your elements you can easily add pseudo class selectors. 

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
``` js
/* component/text.js */
import styles from './text.css';

import React, { Component } from 'react';

export default class Text extends Component {

  render() {
    return (
      <p className={ styles.text }>Text with hover</p>
    );
  }

};
```
