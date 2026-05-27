import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';
import userEmojiRegistry, { clearUserEmojis } from 'datafruits13/utils/user-emoji-registry';
import emojiStrategy from 'datafruits13/emojiStrategy';

module('Unit | Service | current-user', function (hooks) {
  setupTest(hooks);

  hooks.afterEach(function () {
    clearUserEmojis();
  });

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:current-user');
    assert.ok(service);
  });

  test('it registers custom emojis when the current user loads', async function (assert) {
    class SessionStub extends Service {
      isAuthenticated = true;
      data = { authenticated: { id: '123' } };
    }

    const user = {
      customEmojis: [
        {
          name: 'dj_wave',
          imageUrl: 'https://example.com/dj_wave.png',
        },
      ],
    };

    class StoreStub extends Service {
      peekRecord() {
        return user;
      }
    }

    this.owner.register('service:session', SessionStub);
    this.owner.register('service:store', StoreStub);

    let service = this.owner.lookup('service:current-user');
    await service.load();

    assert.deepEqual(userEmojiRegistry[':dj_wave:'], {
      name: 'dj_wave',
      imageUrl: 'https://example.com/dj_wave.png',
    });
    assert.true(emojiStrategy[':dj_wave:'].userUploaded);
  });
});
