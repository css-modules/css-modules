## Exceptions

+ [global and local scopes](#Global-Local-scopes)
+ [pseudo-selectors](#pseudo-selectors-+-tags)

#### Global Local Scopes
`:global` switches to global scope for the current selector resp. identifier. `:global(.xxx)` resp. `@keyframes :global(xxx)` declares a the stuff in brackets in the global scope.

Similar `:local` and `:local(...)` for local scope.

If the selector is switched into global mode, global mode is also activated for the rules. (this allows to make `animation: abc;` local)

Example: `.localA :global .global-b .global-c :local(.localD.localE) .global-d`

#### Pseudo-Selectors + tags
Ok, so. Yes. This is a problem. Let me give you some background (maybe you're already across this but for other readers of this issue):

composes works by exporting multiple classnames from the CSS. So, when you have

```css
.foo {
  color: red;
}
.bar {
  composes: foo;
  background-color: blue;
}

import styles from "./foo.css";

return "<p class='${styles.bar}'>Content</p>"
```

You get the following ICSS:

```css
:export {
  foo: foo_98812cadf;
  bar: foo_98812cadf bar_312cbca63;
}
.foo_98812cadf {
  color: red;
}
.bar_312cbca63 {
  background-color: blue;
}
```

So, your HTML renders out as `<p class='foo_98812cadf bar_312cbca63'>Content</p>` and you get all of `.foo` and `.bar` styles. But the only way that works is through classes. Think of composes as an instruction to JavaScript to include this extra class whenever you reference this one. It relies on dynamic markup to work.

So if you don't have control over the markup being injected then composition doesn't work.
`.foo :global(p)` will still give you localisation, of course, but if you're building your whole site using composition that's not ideal.

I actually faced this exact problem and wrote a monstrous JSPM loader for it. It parses the markdown as YAML (for frontmatter), then markdown then JSX, then returns an ES6 function that accepts a styles object. I think. I can never remember, I wanted to tidy it up and release it but it breaks if I touch it...

It gets used here and lets me do cool stuff with inline JSX in markdown:

But I digress, back to the issue at hand.

Theoretically, you could write a runtime JS component that gave you this more advanced behaviour, where it watches the live DOM and attaches classes based on these more advanced rules. That could be kind of neat, but at this stage it's not something I'm going to work on. For one, I am trying to avoid using descendent selectors & bare tags as much as possible, except for contextual overrides that don't care about the nature of the things they're overriding. E.g:

```css
.MyComponent {
  > * {
    margin-top: 1rem;
  }
  > :first-child {
    margin-top: 0;
  }
}
```

Secondly, if you add a runtime dependency you need to be damn careful not to break server-side rendering. Because all the React SSR stuff already evaluates the render tree, injecting classnames there works really nicely. And since we're using plain-old-CSS, we get pseudo-selectors like :hover for free (Radium has problems with that). I think we can do it, but I'm not sure if it's worth it. And if we want to support traditional stuff like Rails (which we should!)

Probably should also point out that the following usages of composes don't work for the same reasons:

```css
.foo .bar {
  composes: different-when-nested;
}
@media (max-width: 599px) {
  .bar {
    composes: something-on-small-breakpoint;
  }

}
The media query one, at least, has a decent fallback:

/* A class can use media queries then get composed */
.headline {
  font-size: 4rem;
}

@media (max-width: 599px) {
  .headline {
    font-size: 3rem;
  }
}

/* You can use suffixes like Tachyons/Basscss */
.foo {
  color: red;
}

@media (max-width: 599px) {
  .foo--small {
    color: red;
  }
}

.bar {
  composes: headline foo--small;
}
```

The thing I like about this is that we're building our own abstractions on top of the basic CSS mechanisms. I see composes as constrained, yes, but it feels like it's worth embracing this constraint for the time being to see where it leads us :)

##### solution:
```css
.icon {
  /* maybe something here, maybe nothing */
}

.icon::before {
  /* style to add an icon before a button*/
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-top: -10px;
  font-size: 14px;
}

.button {
  composes: button from './component/button.css';
  composes: icon;
  color: #fff;
}
````
