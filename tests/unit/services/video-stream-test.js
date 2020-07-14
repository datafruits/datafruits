import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | video-stream', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:video-stream');
    assert.ok(service);
  });
});
