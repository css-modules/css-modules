import postcss from 'postcss'

const localRegexp = /^\:local\(\.(\w+)\)$/

const processor = (css, result) => {
  let exports = {};

  // Find any :local declarations
  css.eachRule(rule => {
    let match = rule.selector.match(localRegexp)
    if (match) {
      let [_, exportedName] = match,
        generatedClassName = processor.generateClassName(css.source.input.from, exportedName)
      exports[exportedName] = exports[exportedName] || []
      exports[exportedName].push(generatedClassName)
      rule.selector = `.${generatedClassName}`
    }
  })

  // If we found any :locals, insert an :export rule
  let exportedNames = Object.keys(exports)
  if (exportedNames.length > 0) {
    css.prepend(postcss.rule({
      selector: `:export`,
      before: "\n",
      nodes: exportedNames.map(exportedName => postcss.decl({
        prop: exportedName,
        value: exports[exportedName].join(" "),
        before: "\n  "
      }))
    }))
  }
}

processor.generateClassName = (path, exportedName) => {
  let sanitisedPath = path.replace(/\.[^\.\/\\]+$/, '').replace(/[\W_]+/g, '_').replace(/^_|_$/g,'')
  return `_${sanitisedPath}__${exportedName}`
}

export default processor
