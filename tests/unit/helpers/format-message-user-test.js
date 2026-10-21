import { formatMessageUser } from 'datafruits13/helpers/format-message-user';
import { module, test } from 'qunit';

module('Unit | Helper | format message user', function () {
  test('it works', function (assert) {
    let result = formatMessageUser(['some-username']);
    assert.ok(result);
  });
});