<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/css-modules/css-modules/assets/9113740/f0de16c6-aee2-4fb7-8752-bf400cc5145e">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png">
  <img alt="CSS Modules Logo" src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150">
</picture>

# Theming

Instead of importing a style in the component, the component can take a style as property. This way different themes can be used. The user can even define custom themes.

```css
/* component/theme-a.css */
.outer {
  background: green;
}
.inner {
  color: blue;
}
```

```css
/* component/theme-b.css */
.outer {
  background: red;
}
.inner {
  color: yellow;
}
```

```js
/* component/index.js */
export function Component({ theme }) {
  return (
    <div className={theme.outer}>
      <div className={theme.inner} />
    </div>
  );
}
```

```js
import themeA from 'component/theme-a.css';
import themeB from 'component/theme-b.css';
import customTheme from './custom-theme.css';

import { Component } from 'component';

<Component theme={themeA} />
<Component theme={themeB} />
<Component theme={customTheme} />
```
