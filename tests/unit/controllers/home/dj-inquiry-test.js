import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | home/dj inquiry', function (hooks) {
  setupTest(hooks);

  test('coc-accepted is disabled by default', function (assert) {
    let controller = this.owner.lookup('controller:home/dj-inquiry');
    assert.equal(controller.cocAccepted, false, 'cocAccepted equals false');
  });
});
