import postcss from "postcss";

const createImports = imports => {
  return Object.keys(imports).map(path => {
    const aliases = imports[path];
    const declarations = Object.keys(aliases).map(key =>
      postcss.decl({
        prop: key,
        value: aliases[key],
        raws: { before: "\n  " }
      })
    );

    const hasDeclarations = declarations.length > 0;

    const rule = postcss.rule({
      selector: `:import('${path}')`,
      raws: { after: hasDeclarations ? "\n" : "" }
    });

    if (hasDeclarations) {
      rule.append(declarations);
    }

    return rule;
  });
};

const createExports = exports => {
  const declarations = Object.keys(exports).map(key =>
    postcss.decl({
      prop: key,
      value: exports[key],
      raws: { before: "\n  " }
    })
  );

  if (declarations.length === 0) {
    return [];
  }

  const rule = postcss
    .rule({
      selector: `:export`,
      raws: { after: "\n" }
    })
    .append(declarations);

  return [rule];
};

const createICSSRules = (imports, exports) => [
  ...createImports(imports),
  ...createExports(exports)
];

export default createICSSRules;
