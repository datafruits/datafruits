import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | hat', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:hat');
    assert.ok(route);
  });
});
