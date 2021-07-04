import { module, test } from 'qunit';
import validateUniqueEmail from 'datafruits13/validators/unique-email';

module('Unit | Validator | unique-email', function() {
  test('it exists', function (assert) {
    assert.ok(validateUniqueEmail());
  });
});
