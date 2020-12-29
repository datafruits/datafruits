import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/password-reset', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:home/password-reset');
    assert.ok(route);
  });
});
