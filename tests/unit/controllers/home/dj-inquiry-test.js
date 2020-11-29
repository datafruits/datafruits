import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | home/dj inquiry', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:home/dj-inquiry');
    assert.ok(controller);
  });

  test('it renders', async function (assert) {
    let controller = this.owner.lookup('controller:home/dj-inquiry');
    assert.equal(controller.cocAccepted, false, 'cocAccepted equals false');
  });
});
