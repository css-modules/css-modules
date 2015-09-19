/* global describe, it */

import postcss from 'postcss'
import assert from 'assert'

import replaceSymbols from '../src'

const test = (input, translations, expected) => {
  let processor = postcss([css => replaceSymbols(css, translations)])
  assert.equal(processor.process(input).css, expected)
}

describe('replace-symbols', () => {
  it('should return empty CSS unchanged', () => {
    test('', {}, '')
  })

  it('should not change unless there are translations', () => {
    test('.foo { color: red }', {}, '.foo { color: red }')
  })

  it('should not change class names', () => {
    test('.foo { color: red }', {foo: 'bar'}, '.foo { color: red }')
  })

  it('should change declaration values', () => {
    test('.foo { color: red }', {red: 'blue'}, '.foo { color: blue }')
  })
})

