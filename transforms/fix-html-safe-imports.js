/**
 * @file Updates `htmlSafe` imports from `@ember/string` to `@ember/template`
 * @parser ts
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.ImportDeclaration).forEach((path) => {
    const importDecl = path.node;

    if (importDecl.source.value !== '@ember/string') return;

    const specifiers = importDecl.specifiers;

    const htmlSafeSpecifier = specifiers.find(
      (s) =>
        j.ImportSpecifier.check(s) &&
        s.imported.name === 'htmlSafe'
    );

    if (!htmlSafeSpecifier) return;

    // If this is the only import in the statement
    if (specifiers.length === 1) {
      // Change the source directly
      importDecl.source = j.literal('@ember/template');
    } else {
      // Remove htmlSafe from the current import
      importDecl.specifiers = specifiers.filter(
        (s) =>
          !(
            j.ImportSpecifier.check(s) &&
            s.imported.name === 'htmlSafe'
          )
      );

      // Add a new import declaration for htmlSafe
      const newImport = j.importDeclaration(
        [j.importSpecifier(j.identifier('htmlSafe'))],
        j.literal('@ember/template')
      );

      // Insert it after the current one
      j(path).insertAfter(newImport);
    }
  });

  return root.toSource({ quote: 'single' });
};
