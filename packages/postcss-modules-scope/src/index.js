import postcss from 'postcss';

const localRegexp = /^\:local\(\.?([\w-]+)\)$/;

const processor = (css) => {
  let exports = {};

  // Find any :local classes
  css.eachRule(rule => {
    let match = rule.selector.match(localRegexp);
    if (match) {
      let [/*match*/, exportedName] = match;
      let scopedName = processor.generateScopedName(css.source.input.from, exportedName);
      exports[exportedName] = exports[exportedName] || [];
      exports[exportedName].push(scopedName);
      rule.selector = `.${scopedName}`;
      rule.eachDecl(/extends/, decl => {
        let classes = decl.value.split(/ from /)[0];
        exports[exportedName].push(classes);
        decl.removeSelf();
      });
    }
  });

  // Find any :local keyframes
  css.eachAtRule("keyframes", atRule => {
    let match = atRule.params.match(localRegexp);
    if (match) {
      let [/*match*/, exportedName] = match,
        scopedName = processor.generateScopedName(css.source.input.from, exportedName);
      exports[exportedName] = exports[exportedName] || [];
      exports[exportedName].push(scopedName);
      atRule.params = scopedName;
    }
  });

  // If we found any :locals, insert an :export rule
  let exportedNames = Object.keys(exports);
  if (exportedNames.length > 0) {
    css.prepend(postcss.rule({
      selector: `:export`,
      before: "\n",
      nodes: exportedNames.map(exportedName => postcss.decl({
        prop: exportedName,
        value: exports[exportedName].join(" "),
        before: "\n  "
      }))
    }));
  }
};

processor.generateScopedName = (path, exportedName) => {
  let sanitisedPath = path.replace(/\.[^\.\/\\]+$/, '').replace(/[\W_]+/g, '_').replace(/^_|_$/g, '');
  return `_${sanitisedPath}__${exportedName}`;
};

export default processor;
