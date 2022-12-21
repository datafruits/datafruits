import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/forum', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:home/forum');
    assert.ok(route);
  });
});
