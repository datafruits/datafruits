import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | podcast-favorite', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('podcast-favorite', {});
    assert.ok(model);
  });

  test('it has the right relationships', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('podcast-favorite', {});
    
    // Check that the model has the expected relationship fields
    assert.ok(model.user !== undefined, 'model should have user relationship');
    assert.ok(model.podcast !== undefined, 'model should have podcast relationship');
  });
});