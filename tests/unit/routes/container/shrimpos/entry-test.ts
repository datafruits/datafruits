import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | container/shrimpos/entry', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:container/shrimpos/entry');
    assert.ok(route);
  });
});
