import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import dayjs from 'dayjs';

module('Unit | Model | dj', function (hooks) {
  setupTest(hooks);

  test('it determines next show when given a list of scheduled shows', function (assert) {
    let store = this.owner.lookup('service:store');
    let showYesterday = store.createRecord('scheduled-show', { start: dayjs().subtract(1, 'days') });
    let showTomorrow = store.createRecord('scheduled-show', { start: dayjs().add(1, 'days') });
    let model = store.createRecord('dj', {
      scheduledShows: [showYesterday, showTomorrow],
    });

    assert.equal(model.nextShow, showTomorrow);
  });
});
