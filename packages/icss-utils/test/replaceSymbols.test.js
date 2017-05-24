const postcss = require('postcss')
const { replaceSymbols } = require('../src')

const run = (input, replacements, expected) => {
  return postcss([css => replaceSymbols(css, replacements)])
    .process(input)
    .then(result => {
      expect(result.css).toEqual(expected)
    })
}

describe('replace-symbols', () => {
  it('should return empty CSS unchanged', () => {
    return run('', {}, '')
  })

  it('should not change unless there are translations', () => {
    return run('.foo { color: red }', {}, '.foo { color: red }')
  })

  it('should not change class names', () => {
    return run('.foo { color: red }', { foo: 'bar' }, '.foo { color: red }')
  })

  it('should not change property names', () => {
    return run(
      '.foo { color: red }',
      { color: 'background' },
      '.foo { color: red }'
    )
  })

  it('should change declaration values', () => {
    return run('.foo { color: red }', { red: 'blue' }, '.foo { color: blue }')
  })

  it('should change symbols within declaration values', () => {
    return run(
      '.foo { box-shadow: 0 0 0 4px red }',
      { red: 'blue' },
      '.foo { box-shadow: 0 0 0 4px blue }'
    )
  })

  it('should change multiple symbols within declaration values', () => {
    return run(
      '.foo { box-shadow: top left blur spread color }',
      { top: '1px', left: '2px', blur: '3px', spread: '4px', color: 'red' },
      '.foo { box-shadow: 1px 2px 3px 4px red }'
    )
  })

  it('should change complex symbols, if you feel like trolling yourself', () => {
    return run(
      '.foo { box-shadow: 1px 0.5em 3px $sass-a #f00 }',
      {
        '1px': '1rem',
        '0.5em': '10px',
        '3px': '$sass-b',
        '$sass-a': '4px',
        '#f00': 'green'
      },
      '.foo { box-shadow: 1rem 10px $sass-b 4px green }'
    )
  })

  it('should be able to rewrite variables', () => {
    return run(
      '.foo { color: var(--red) }',
      { '--red': '--blue' },
      '.foo { color: var(--blue) }'
    )
  })

  it('should not replace half a variable', () => {
    return run(
      '.foo { color: colors.red; background: red.blue; }',
      { red: 'green', blue: 'white' },
      '.foo { color: colors.red; background: red.blue; }'
    )
  })

  it('should not replace a replacement', () => {
    return run(
      '.foo { background: blue; color: red }',
      { red: 'blue', blue: 'green' },
      '.foo { background: green; color: blue }'
    )
  })

  it('should not get trolled by me', () => {
    return run(
      '.foo { color: white }',
      { white: 'lightblue', blue: 'green' },
      '.foo { color: lightblue }'
    )
    return run(
      '.foo { color: white }',
      { white: 'light blue', blue: 'green' },
      '.foo { color: light blue }'
    )
  })

  it('should change media queries', () => {
    return run(
      '@media small { .foo { color: red } }',
      { small: '(max-width: 599px)' },
      '@media (max-width: 599px) { .foo { color: red } }'
    )
  })
})
