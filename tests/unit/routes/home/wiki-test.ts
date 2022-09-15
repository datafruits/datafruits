import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/wiki', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:home/wiki');
    assert.ok(route);
  });
});
