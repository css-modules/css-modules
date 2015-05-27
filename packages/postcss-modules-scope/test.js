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
  exportName: _input_css_1__exportName; }
._input_css_1__exportName { color: green; }`
  )

  check("should extract and export a class with the path in there",
    `:local(.exportName) { color: green; }`,
    `
:export {
  exportName: _lib_components_button__exportName; }
._lib_components_button__exportName { color: green; }`,
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

  check("should hoist a single extends class",
    `:local(.exportName) { extends: otherClass; color: green; }`,
    `
:export {
  exportName: _lib_extender__exportName otherClass; }
._lib_extender__exportName { color: green; }`,
    "/lib/extender.css"
  )

  check("should hoist multiple extends class",
    `:local(.exportName) { extends: otherClass andAgain; extends: aThirdClass; color: green; }`,
    `
:export {
  exportName: _lib_extender__exportName otherClass andAgain aThirdClass; }
._lib_extender__exportName { color: green; }`,
    "/lib/extender.css"
  )
})
