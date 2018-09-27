import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | dj inquiry', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:dj-inquiry');
    assert.ok(route);
  });
});
