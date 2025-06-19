/**
 * @file Replaces `.pushObject(...)` with `.push(...)`
 * @parser ts
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      property: { name: 'pushObject' },
    },
  }).forEach((path) => {
    // Change the property name to `push`
    path.node.callee.property.name = 'push';
  });

  return root.toSource({ quote: 'single' });
};
