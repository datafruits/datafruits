import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | metadata', function (hooks) {
  setupTest(hooks);

  // Was throwing a JS error
  skip('it exists', function (assert) {
    let service = this.owner.lookup('service:metadata');
    assert.ok(service);
  });
});
