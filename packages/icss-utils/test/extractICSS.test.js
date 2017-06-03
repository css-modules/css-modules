/* eslint-env jest */
import postcss from "postcss";
import { extractICSS } from "../src";

const runExtract = input => extractICSS(postcss.parse(input));
const runCSS = (input, removeRules) => {
  const css = postcss.parse(input);
  extractICSS(css, removeRules);
  return css.toString();
};

test("extract :import statements with identifier", () => {
  expect(runExtract(":import(col.ors-2) {}")).toEqual({
    icssImports: {
      "col.ors-2": {}
    },
    icssExports: {}
  });
});

test("extract :import statements with single quoted path", () => {
  expect(runExtract(`:import('./colors.css') {}`)).toEqual({
    icssImports: {
      "./colors.css": {}
    },
    icssExports: {}
  });
});

test("extract :import statements with double quoted path", () => {
  expect(runExtract(':import("./colors.css") {}')).toEqual({
    icssImports: {
      "./colors.css": {}
    },
    icssExports: {}
  });
});

test("not extract :import with values", () => {
  expect(
    runExtract(":import(./colors.css) { i__blue: blue; i__red: red; }")
  ).toEqual({
    icssImports: {
      "./colors.css": {
        i__blue: "blue",
        i__red: "red"
      }
    },
    icssExports: {}
  });
});

test("not extract invalid :import", () => {
  expect(runExtract(":import(\\'./colors.css) {}")).toEqual({
    icssImports: {},
    icssExports: {}
  });
});

test("extract :export", () => {
  expect(runExtract(":export { blue: i__blue; red: i__red }")).toEqual({
    icssImports: {},
    icssExports: {
      blue: "i__blue",
      red: "i__red"
    }
  });
});

test("remove :import after extracting", () => {
  expect(runCSS(":import(colors) {} .foo {}")).toEqual(".foo {}");
});

test("remove :export after extracting", () => {
  expect(runCSS(":export {} @media {}")).toEqual("@media {}");
});

test("extract properties with underscore", () => {
  expect(runExtract(":import(colors) {_a: b} :export { _c: d}")).toEqual({
    icssImports: {
      colors: {
        _a: "b"
      }
    },
    icssExports: {
      _c: "d"
    }
  });
});

test("not remove rules from ast with removeRules=false", () => {
  const fixture = ":import(colors) {_a: b} :export {_c: d} .foo {}";
  expect(runCSS(fixture, false)).toEqual(fixture);
});
