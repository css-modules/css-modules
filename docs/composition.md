<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/css-modules/css-modules/assets/9113740/f0de16c6-aee2-4fb7-8752-bf400cc5145e">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png">
  <img alt="CSS Modules Logo" src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150">
</picture>

# Composition

You can compose selectors together with `composes`:

```css
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

It's also possible to compose multiple classes with `composes: classNameA classNameB;`.

### Pseudo classes

Classes which have pseudo selectors attached will be brought along when used in
a `composes` statement.

In the example below, `otherClassName` will also be given the `:hover` pseudo
class defined on `className`.

```css
.className {
  color: green;
}

.className:hover {
  color: red;
}

.otherClassName {
  composes: className;
  background: black;
}
```

`otherClassName` above is the same as defining:

```css
.otherClassName {
  color: green;
  background: black;
}

.otherClassName:hover {
  color: red;
}
```

## Dependencies

### Composing from other files

It's possible to compose class names from other **CSS Modules**.

```css
.otherClassName {
  composes: className from './style.css';
}
```

When composing multiple classes from different files, the order of appliance is _undefined_. Do not define different values for the same property in multiple class names from different files when they are composed in a single class.

Composing should not form a circular dependency. Otherwise, it's _undefined_ whether properties of a rule override properties of a composed rule. The module system may emit an error.

We recommend that classes do a single thing and dependencies are hierarchic.

### Composing from global class names

It's possible to compose from **global** class names.

```css
.otherClassName {
  composes: globalClassName from global;
}
```

## Exceptions

`:global` switches to global scope for the current selector respective identifier. `:global(.xxx)` respective `@keyframes :global(xxx)` declares the stuff in parenthesis in the global scope.

Similarly, `:local` and `:local(...)` for local scope.

```css
:global(.some-selector) {
  /* ... */
}
```

If the selector is switched into global mode, global mode is also activated for the rules. (This allows us to make `animation: abc;` local.)

Example:

```css
.localA :global .global-b .global-c :local(.localD.localE) .global-d {
  /* ... */
}
```
