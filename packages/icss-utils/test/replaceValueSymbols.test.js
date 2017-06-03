/* eslint-env jest */
import { replaceValueSymbols as replace } from "../src";

test("not change empty css", () => {
  expect(replace("", {})).toEqual("");
});

test("not change unless there are translations", () => {
  expect(replace("red", {})).toEqual("red");
});

test("change symbols within values", () => {
  expect(replace("0 0 0 4px red", { red: "blue" })).toEqual("0 0 0 4px blue");
});

test("change multiple symbols within values", () => {
  expect(
    replace("top left blur spread color", {
      top: "1px",
      left: "2px",
      blur: "3px",
      spread: "4px",
      color: "red"
    })
  ).toEqual("1px 2px 3px 4px red");
});

test("change complex symbols, if you feel like trolling yourself", () => {
  expect(
    replace("1px 0.5em 3px $sass-a #f00", {
      "1px": "1rem",
      "0.5em": "10px",
      "3px": "$sass-b",
      "$sass-a": "4px",
      "#f00": "green"
    })
  ).toEqual("1rem 10px $sass-b 4px green");
});

test("rewrite custom properties", () => {
  expect(replace("var(--red)", { "--red": "--blue" })).toEqual("var(--blue)");
});

test("not replace half a variable", () => {
  expect(
    replace("colors.red red.blue", {
      red: "green",
      blue: "white",
      colors: "weights"
    })
  ).toEqual("colors.red red.blue");
});

test("not replace a replacement", () => {
  expect(replace("blue red", { red: "blue", blue: "green" })).toEqual(
    "green blue"
  );
});
