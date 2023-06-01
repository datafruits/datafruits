export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let className;
  className = root.find(j.ClassDeclaration)
    .filter(path => {
      return path.node.superClass.name === 'Component';
    }).get(0).node.id.name;

  // Create the AST nodes for the code to be appended
  const code = `
  declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
      ${className}: typeof ${className};
    }
  }
  `;

  root.get().node.program.body.push(code);

  return root.toSource();
}
