import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | scheduled-show', function (hooks) {
  setupTest(hooks);

  test('it can determine host from djs list', function (assert) {
    let store = this.owner.lookup('service:store');
    let hostDJ = store.createRecord('user');
    let secondDJ = store.createRecord('user');
    let model = store.createRecord('scheduled-show', {
      djs: [hostDJ, secondDJ],
    });

    assert.equal(model.host, hostDJ);
  });
});
