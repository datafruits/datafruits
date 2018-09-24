import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | podcasts', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:podcasts');
    assert.ok(route);
  });
});
