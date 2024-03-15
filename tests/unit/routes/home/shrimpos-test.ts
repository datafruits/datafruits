import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/shrimpos', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:home/shrimpos');
    assert.ok(route);
  });
});
