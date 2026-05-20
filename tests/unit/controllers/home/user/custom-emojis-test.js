import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Unit | Controller | home/user/custom-emojis', function (hooks) {
  setupTest(hooks);

  test('it derives saved and uploaded emojis from current user state', function (assert) {
    const customEmojis = A([
      {
        id: '10',
        name: 'my_wave',
        user: { id: '1' },
      },
      {
        id: '11',
        name: 'friend_wave',
        user: { id: '2' },
      },
    ]);

    class CurrentUserStub extends Service {
      user = {
        id: '1',
        customEmojis,
      };
    }

    this.owner.register('service:current-user', CurrentUserStub);

    const controller = this.owner.lookup('controller:home/user/custom-emojis');

    assert.deepEqual(
      controller.uploadedEmojis.map((emoji) => emoji.id),
      ['10'],
    );
    assert.deepEqual(
      controller.savedEmojis.map((emoji) => emoji.id),
      ['11'],
    );

    customEmojis.pushObject({
      id: '12',
      name: 'another_saved',
      user: { id: '3' },
    });

    assert.deepEqual(
      controller.savedEmojis.map((emoji) => emoji.id),
      ['11', '12'],
    );
  });
});
