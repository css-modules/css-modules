import replaceValueSymbols from './replaceValueSymbols.js'

const replaceSymbols = (css, replacements) => {
  css.walkDecls(
    decl => (decl.value = replaceValueSymbols(decl.value, replacements))
  )
  css.walkAtRules(
    'media',
    atRule => (atRule.params = replaceValueSymbols(atRule.params, replacements))
  )
}

export default replaceSymbols
