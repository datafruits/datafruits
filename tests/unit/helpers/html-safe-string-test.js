import { htmlSafeString } from '../../../app/helpers/html-safe-string';
import { module, test } from 'qunit';

module('Unit | Helper | html safe string', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = htmlSafeString([42]);
    assert.ok(result);
  });
});
