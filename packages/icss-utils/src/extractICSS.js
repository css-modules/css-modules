const importPattern = /^:import\(("[^"]*"|'[^']*'|[^"']+)\)$/;

const getDeclsObject = rule => {
  const object = {};
  rule.walkDecls(decl => {
    object[decl.raws.before.trim() + decl.prop] = decl.value;
  });
  return object;
};

const extractICSS = (css, removeRules = true) => {
  const icssImports = {};
  const icssExports = {};
  css.each(node => {
    if (node.type === "rule") {
      if (node.selector.slice(0, 7) === ":import") {
        const matches = importPattern.exec(node.selector);
        if (matches) {
          const path = matches[1].replace(/'|"/g, "");
          const aliases = Object.assign(
            icssImports[path] || {},
            getDeclsObject(node)
          );
          icssImports[path] = aliases;
          if (removeRules) {
            node.remove();
          }
        }
      }
      if (node.selector === ":export") {
        Object.assign(icssExports, getDeclsObject(node));
        if (removeRules) {
          node.remove();
        }
      }
    }
  });
  return { icssImports, icssExports };
};

export default extractICSS;
