const matchConstName = /[$#]?[\w-\.]+/g

const replaceAllSymbols = (replacements, text) => {
  let matches
  while ((matches = matchConstName.exec(text))) {
    let replacement = replacements[matches[0]]
    if (replacement) {
      text =
        text.slice(0, matches.index) +
        replacement +
        text.slice(matchConstName.lastIndex)
      matchConstName.lastIndex -= matches[0].length - replacement.length
    }
  }
  return text
}

const replaceSymbols = (css, translations) => {
  css.walkDecls(
    decl => (decl.value = replaceAllSymbols(translations, decl.value))
  )
  css.walkAtRules(
    'media',
    atRule => (atRule.params = replaceAllSymbols(translations, atRule.params))
  )
}

exports.replaceAllSymbols = replaceAllSymbols
exports.replaceSymbols = replaceSymbols
