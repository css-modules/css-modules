import postcss from "postcss";
import { replaceSymbols } from "../src";

const replace = (input, replacements) => {
  const ast = postcss.parse(input);
  replaceSymbols(ast, replacements);
  return ast.toString();
};

test("return empty CSS unchanged", () => {
  expect(replace("", {})).toEqual("");
});

test("not change property names", () => {
  expect(replace(".foo { color: red }", { color: "background" })).toEqual(
    ".foo { color: red }"
  );
});

test("not change non-media at-rules", () => {
  expect(replace("@import url;", { url: "otherUrl" })).toEqual("@import url;");
});

test("change declaration values", () => {
  expect(replace(".foo { color: red }", { red: "blue" })).toEqual(
    ".foo { color: blue }"
  );
});

test("should change media queries", () => {
  expect(
    replace("@media small { .foo { color: red } }", {
      small: "(max-width: 599px)"
    })
  ).toEqual("@media (max-width: 599px) { .foo { color: red } }");
});

test("should change media queries uppercase", () => {
  expect(
    replace("@MEDIA small { .foo { color: red } }", {
      small: "(max-width: 599px)"
    })
  ).toEqual("@MEDIA (max-width: 599px) { .foo { color: red } }");
});

test("should change supports", () => {
  expect(
    replace("@supports dgvalue { .foo { color: red } }", {
      dgvalue: "(display: grid)"
    })
  ).toEqual("@supports (display: grid) { .foo { color: red } }");
});

test("should change supports (uppercase)", () => {
  expect(
    replace("@SUPPORTS dgvalue { .foo { color: red } }", {
      dgvalue: "(display: grid)"
    })
  ).toEqual("@SUPPORTS (display: grid) { .foo { color: red } }");
});

test("should replace class names and id in selectors", () => {
  expect(
    replace(".className1.className2 #id1#id2 { color: red }", {
      className1: "__className",
      id1: "__id",
      "className1.className2": "__badClass",
      "id1#id2": "__badId"
    })
  ).toEqual(".__className.className2 #__id#id2 { color: red }");
});
