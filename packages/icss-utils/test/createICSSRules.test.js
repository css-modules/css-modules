import postcss from "postcss";
import { createICSSRules } from "../src";

const run = (imports, exports) => {
  return postcss
    .root()
    .append(createICSSRules(imports, exports))
    .toString();
};

test("create empty :import statement", () => {
  expect(
    run(
      {
        "path/file": {}
      },
      {}
    )
  ).toEqual(":import('path/file') {}");
});

test("create :import statement", () => {
  expect(
    run(
      {
        "path/file": {
          e: "f"
        }
      },
      {}
    )
  ).toEqual(":import('path/file') {\n  e: f\n}");
});

test("create :export statement", () => {
  expect(
    run(
      {},
      {
        a: "b",
        c: "d"
      }
    )
  ).toEqual(":export {\n  a: b;\n  c: d\n}");
});

test("create :import and :export", () => {
  expect(
    run(
      {
        colors: {
          a: "b"
        }
      },
      {
        c: "d"
      }
    )
  ).toEqual(":import('colors') {\n  a: b\n}\n:export {\n  c: d\n}");
});
