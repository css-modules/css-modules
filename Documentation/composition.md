## Composition

It's possible to compose selectors.

``` css
.className {
  color: green;
  background: red;
}

.otherClassName {
  composes: className;
  color: yellow;
}
```

There can be multiple `composes` rules, but `composes` rules must be before other rules. Extending works only for local-scoped selectors and only if the selector is a single class name. When a class name composes another class name, the **CSS Module** exports both class names for the local class. This can add up to multiple class names.

It's possible to compose multiple classes with `composes: classNameA classNameB;`.

## Dependencies

It's possible to compose class names from other **CSS Modules**.

``` css
.otherClassName {
  composes: className from "./style.css";
}
```

Note that when composing multiple classes from different files the order of appliance is *undefined*. Make sure to not define different values for the same property in multiple class names from different files when they are composed in a single class.

Note that composing should not form a circular dependency. Elsewise it's *undefined* whether properties of a rule override properties of a composed rule. The module system may emit an error.

Best if classes do a single thing and dependencies are hierarchic.
