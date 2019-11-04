import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/djs', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:home/djs');
    assert.ok(route);
  });
});
