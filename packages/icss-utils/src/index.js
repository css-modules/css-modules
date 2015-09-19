const matchConstName = /[\w-]+/g

const replace = (declarations, object, propName) => {
  let matches
  while ((matches = matchConstName.exec(object[propName]))) {
    let replacement = declarations[matches[0]]
    if (replacement) {
      object[propName] = object[propName].slice(0, matches.index) + replacement + object[propName].slice(matchConstName.lastIndex)
      matchConstName.lastIndex -= matches[0].length - replacement.length
    }
  }
}

export default (css, translations) => {
  css.eachDecl(decl => replace(translations, decl, 'value'))
  css.eachAtRule('media', atRule => replace(translations, atRule, 'params'))
}
