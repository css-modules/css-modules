/* eslint-env jest */
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

test("not change class names", () => {
  expect(replace(".foo { color: red }", { foo: "bar" })).toEqual(
    ".foo { color: red }"
  );
});

test("not change property names", () => {
  expect(replace(".foo { color: red }", { color: "background" })).toEqual(
    ".foo { color: red }"
  );
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
