import { module, test } from 'qunit';
import validateUniqueUsername from 'datafruits13/validators/unique-username';

module('Unit | Validator | unique-username');

test('it exists', function(assert) {
  assert.ok(validateUniqueUsername());
});
