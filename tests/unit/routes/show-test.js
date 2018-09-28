import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | show', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:show');
    assert.ok(route);
  });
});
