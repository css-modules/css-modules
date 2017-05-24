const importPattern = /^:import\(("[^"]*"|'[^']*'|[\w-\.]+)\)$/

const getDeclsObject = rule => {
  const object = {}
  rule.walkDecls(decl => {
    object[decl.prop] = decl.value
  })
  return object
}

const extractICSS = css => {
  const icssImports = {}
  const icssExports = {}
  css.each(node => {
    if (node.type === 'rule') {
      if (node.selector.slice(0, 7) === ':import') {
        const matches = importPattern.exec(node.selector)
        if (matches) {
          const path = matches[1]
          const aliases = Object.assign(
            icssImports[path] || {},
            getDeclsObject(node)
          )
          icssImports[path] = aliases
          node.remove()
        }
      }
      if (node.selector === ':export') {
        Object.assign(icssExports, getDeclsObject(node))
        node.remove()
      }
    }
  })
  return { icssImports, icssExports }
}

export default extractICSS
