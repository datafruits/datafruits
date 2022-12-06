import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/wiki/edit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:home/wiki/edit');
    assert.ok(route);
  });
});
