import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/new-password', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:home/new-password');
    assert.ok(route);
  });
});
