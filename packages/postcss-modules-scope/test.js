import assert from "assert"
import postcss from "postcss"
import processor from "./index.src.js"

let pipeline = postcss([processor]),
  check = (desc, input, expected, inputFilename) => {
    it(desc, () => {
      assert.equal(pipeline.process(input, {from: inputFilename}).css, expected)
    })
  }

describe("processor", () => {
  check("should extract and export a class",
    `:local(.exportName) { color: green; }`,
    `
:export {
  exportName: _input_css_1__exportName;
}
:local { color: green; }`
  )

  check("should extract and export a class with the path in there",
    `:local(.exportName) { color: green; }`,
    `
:export {
  exportName: _lib_components_button__exportName;
}
:local { color: green; }`,
    '/lib/components/button.css'
  )

  it("should only rewrite the selector that's actually being localised")
    /*
    `
:local(.exportName),.globalName {
  color: green;
}
.globalTwo,:local(.exportTwo) {
  color: blue;
}
`,
    `
:export {
  exportName: _lib_components_button__exportName;
  exportTwo: _lib_components_button__exportTwo;
}
._lib_components_button__exportName,.globalName {
  color: green;
}
.globalTwo,._lib_components_button__exportTwo {
  color: blue;
}`,
    '/lib/components/button.css')*/
})
