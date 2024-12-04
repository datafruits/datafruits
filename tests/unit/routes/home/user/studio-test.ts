import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/user/studio', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:home/user/studio');
    assert.ok(route);
  });
});
