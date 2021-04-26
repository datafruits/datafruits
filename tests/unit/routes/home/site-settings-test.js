import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/site-settings', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:home/site-settings');
    assert.ok(route);
  });
});
