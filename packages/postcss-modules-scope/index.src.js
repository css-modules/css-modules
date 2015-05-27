import postcss from 'postcss'
import {CssSelectorParser} from 'css-selector-parser'

const processor = (css, result) => {
  const parser = new CssSelectorParser;
  let exports = {};

  // Find any :local declarations
  css.eachRule(rule => {
    let parsed = parser.parse(rule.selector),
      selectors = parsed.type === 'ruleSet' ? [parsed] : parsed.selectors,
      converted = selectors.map(selector => {
        let pseudos = selector.rule.pseudos || []
        pseudos.forEach(pseudo => {
          if (pseudo.name === "local") {

          }
        })
        return parser.render(selector)
      })
    rule.selector = converted.join(',')
  })

  // If we found any :locals, insert :export rules
  Objects.keys()
}

export default processor
