import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | track', function(hooks) {
  setupTest(hooks);

  test('it has labelNames calculated from labels', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('track', {
      labels: [
        store.createRecord('label', { name: 'foo' }),
        store.createRecord('label', { name: 'bar' }),
      ],
    });
    assert.deepEqual(model.labelNames, ['foo', 'bar']);
  });
});
