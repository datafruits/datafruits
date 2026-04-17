import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | container/chat', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:container/chat');
    assert.ok(route);
  });
});
