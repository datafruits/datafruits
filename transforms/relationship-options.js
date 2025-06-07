/**
 * @file Adds default options { async: false, inverse: null } to
 *       @hasMany and @belongsTo decorators if missing.
 * @parser ts
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const TARGET_DECORATORS = ['hasMany', 'belongsTo'];

  root.find(j.ClassProperty).forEach((path) => {
    const decorators = path.node.decorators;
    if (!decorators || decorators.length === 0) return;

    decorators.forEach((decorator) => {
      const expr = decorator.expression;

      // Match @hasMany(...) or @belongsTo(...)
      if (
        j.CallExpression.check(expr) &&
        j.Identifier.check(expr.callee) &&
        TARGET_DECORATORS.includes(expr.callee.name)
      ) {
        const args = expr.arguments;

        if (args.length === 0) return;

        if (args.length === 1) {
          // Only has type argument, add options object
          const optionsObj = j.objectExpression([
            j.property('init', j.identifier('async'), j.literal(false)),
            j.property('init', j.identifier('inverse'), j.literal(null)),
          ]);
          args.push(optionsObj);
        } else if (args.length === 2 && j.ObjectExpression.check(args[1])) {
          // Already has options, add missing ones
          const existingProps = args[1].properties;

          const hasAsync = existingProps.some(
            (prop) => j.Identifier.check(prop.key) && prop.key.name === 'async'
          );
          const hasInverse = existingProps.some(
            (prop) =>
              j.Identifier.check(prop.key) && prop.key.name === 'inverse'
          );

          if (!hasAsync) {
            existingProps.push(
              j.property('init', j.identifier('async'), j.literal(false))
            );
          }

          if (!hasInverse) {
            existingProps.push(
              j.property('init', j.identifier('inverse'), j.literal(null))
            );
          }
        }
      }
    });
  });

  return root.toSource({ quote: 'single' });
};
