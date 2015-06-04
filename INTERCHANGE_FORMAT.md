<img src="https://raw.githubusercontent.com/css-modules/logos/master/css-modules-logo.png" width="150" height="150" />

# CSS Interchange Format (CIF)

This document describes the specification of the low-level file format that enabled CSS Modules. This is designed for loader-implementers, not for end-users. For the high-level specification, see the full [CSS Modules](https://github.com/css-modules/css-modules/blob/master/README.md) spec.

## Rationale

As JavaScript workflows have trended towards building collections of components, CSS workflows have followed suit. However, any progress on the CSS front has been purely *conventional*, not supported by the language. The most visible example of this is the [BEM methodology](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/), but the argument is common to many approaches:

- Styles should be scoped to a single component
- All CSS selectors are global
- ∴ Develop a convention for ensuring globally-unique selectors

In BEM, that takes the form `.block-name__element-name--modifier-name`, or `.BlockName__elementName--modifierName`.

### Explicit cross-language dependencies

One of the fundamental features of the Webpack loader (which is also core to JSPM and easily possible with Browserify) is the ability to explicitly describe each file's dependencies **regardless of the type of source file**. For CSS in a component workflow, that takes the following form:

```js
// Marks the CSS as being a dependency of this JS.
// Depending on the loader, the CSS is either injected
// into the DOM or bundled into a separate CSS package.
require( './my-component.css' );
var MyComponent = // component definition
module.exports = MyComponent;
```

Now, whenever `my-component.js` is loaded or bundled, the corresponding CSS is guaranteed to be present, just like any other dependency. This convention leads us to a new capability, and necessitates a new specification.

### CSS - JS interoperability

By treating the CSS as a dependency of our JS, we have the opportunity do to something hitherto impossible – **pass variables from CSS to JS**. For example, instead of this:

```js
// loads the CSS as a side-effect
require( './my-component.css' );
```

we can now pass arbitrary information to our loader:

```js
// loads the CSS as a side-effect and returns
// something we can use in rendering our component.
var styles = require( './my-component.css' );
// this might be a dynamically-generated classname:
elem.addClass( styles.elemClass );
```

This is the key capability that is new to modern multi-format loaders like Webpack, JSPM and Browserify, and the [CSS Modules Specification](https://github.com/css-modules/css-modules/blob/master/README.md) is an opinionated proposal of new CSS techniques this enables. However, at the fundamental level, we need a specification that describes the *mechanism* by which these symbols are passed around.

## Specification

CSS Interchange Format (CIF) is a superset of standard CSS, making use of two additional pseudo-selectors:

```css
:exports {
  exportedKey: exportedValue;
	/* ... */
}
:imports("path") {
  importedKey: localAlias;
  /* ... */
}
```

### :exports

An `:exports` block defines the symbols that are going to exported to the consumer. It can be thought of functionally equivalent to the following JS:

```js
module.exports = {
	"exporedKey": "exportedValue"
}
```

The following restrictions are placed on the `:export` syntax:

- It must be at the top level, but can be anywhere in the file.
- If there is more than one in a file, the keys and values are combined and exported together.
- If a particular `exportedKey` is duplicated, the last (in source order) takes precedence.
- Exported values may contain any character valid for CSS declaration values.
- Exported values do not need to be quoted, they are treated as a literal string anyway.

The following are desirable for output readability, but not enforced:

- There should be only one `:export` block
- It should at the top of the file, but after any `:import` blocks

### :import

An `:import` statement allows importing variables from other CSS files. It performs the following operations:

- Fetch & process the dependency
- Resolve the dependency's exports against the imported tokens, and match them up to a `localAlias`
- Find and replace the usages of `localAlias` in certain places (described below) within the current file with the dependency's `exportedValue`.

The places within the CSS file that are checked for `localAlias` are:

- In any declaration value:
e.g. `border: 1px solid localAlias;`
- In any selector:
e.g. `.localAlias .MyComponent {}`
- In a media query argument:
e.g. `@media screen and localAlias`

This allows considerable flexibility about what can be imported and used in a file. It also demands that a particular local alias is distinct enough to not cause false positives during the replacement process. The following restrictions apply:

- It must be at the top level
- Each file can import from multiple dependencies, and import many symbols
- A local alias must be a single term, consisting of only alphanumeric characters, underscores and dashes. It must also be unique for the file to avoid clashes.

And the following properties are desirable for readability but not enforced:

- There should be one import per dependency
- All imports should be at the top of the file

# Contributions

Edit this file and make your change to the spec, then send a PR with your argument for why the change should be made. All contributions are welcome.

## Acknowledgements

With thanks to:
- Mark Dalgleish
- Tobias Koppers
- Ben Smithett
- Guy Bedford

---

Glen Maddern, 2015.