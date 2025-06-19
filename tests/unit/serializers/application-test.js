import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Serializer | application', function (hooks) {
  setupTest(hooks);

  skip('it serializes records', function (assert) {
    let record = run(() => this.owner.lookup('service:store').createRecord('track', {}));

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
