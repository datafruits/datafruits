import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/about', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    var route = this.owner.lookup('route:home/about');
    assert.ok(route);
  });
});
