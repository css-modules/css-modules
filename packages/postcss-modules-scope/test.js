import assert from "assert"
import postcss from "postcss"
import processor from "./index.src.js"

let pipeline = postcss([processor]),
  check = (desc, input, expected, randomStrs) => {
    it(desc, () => {
      processor.getRandomStr = randomStrs ? () => randomStrs.shift() : processor.defaultRandomStr
      assert.equal(pipeline.process(input).css, expected)
    })
  }

describe("processor", () => {
  it("should do something I guess")
})
