import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/timetable', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    var route = this.owner.lookup('route:home/timetable');
    assert.ok(route);
  });
});
