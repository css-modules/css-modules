### Theming

Instead of importing a style in the component, the component can take a style as property. This way different themes can be used. The user can even define custom themes.

``` css
/* component/theme-a.css */
.outer { background: green; }
.inner { color: blue; }
```

``` css
/* component/theme-b.css */
.outer { background: red; }
.inner { color: yellow; }
```

``` js
/* component/index.js */
export default class Component {
  constructor(theme) {
    this.theme = theme;
  }
  render() {
    var theme = this.theme;
    return '<div class="' + theme.outer + '">' +
      '<div class="' + theme.inner + '">' +
      '</div></div>';
  }
}
```

``` js
/* application */
import themeA from "component/theme-a.css";
import themeB from "component/theme-b.css";
import customTheme from "./custom-theme.css";

import Component from "component";

// use the Component
new Component(themeA);
new Component(themeB);
new Component(customTheme);
```
