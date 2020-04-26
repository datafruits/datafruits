import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | gif', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('gif');

    assert.ok(serializer);
  });

  test('it serializes records', function(assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('gif', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
