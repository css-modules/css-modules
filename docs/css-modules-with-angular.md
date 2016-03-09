<img src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150" />

# CSS Modules with Angular

```css
.bacon { /* ... */ }
.pancakes { /* ... */ }
```

```js
import styles from "./component.css"

angular.module('myApp').controller('MyController', ($scope) => {
  $scope.styles = styles
})
```

```html
<div ng-app="myApp">
  <div ng-controller="MyController">
    <header class="{{::styles.bacon + ' ' + styles.pancakes}}">
      <h1 class="{{styles.pancakes}}">pancakes (2-way binding)</h1>
      <h1 ng-class="styles.bacon">bacon</h1>
        <!-- ... --->
    </header>
  </div>
</div>
```

---

**This needs expansion/revision by someone who really knows angular. Maybe that's you!**

- [ ] Controller vs Directive examples/rationale
- [ ] Angular 2.0 syntax
- [ ] Is that even how people are doing Angular 1 these days? It's been so long.
