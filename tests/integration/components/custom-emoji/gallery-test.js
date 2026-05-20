import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { A } from '@ember/array';
import Service from '@ember/service';
import { setupIntl } from 'ember-intl/test-support';
import userEmojiRegistry, { clearUserEmojis } from 'datafruits13/utils/user-emoji-registry';

module('Integration | Component | custom-emoji/gallery', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'en-us');

  hooks.afterEach(function () {
    clearUserEmojis();
  });

  test('it lets a user save another djs custom emoji', async function (assert) {
    assert.expect(6);

    const userEmojis = A([]);

    class CurrentUserStub extends Service {
      user = {
        id: '1',
        userEmojis,
      };
    }

    class SessionStub extends Service {
      isAuthenticated = true;
    }

    class StoreStub extends Service {
      createRecord(type, attrs) {
        assert.strictEqual(type, 'user-emoji');
        assert.deepEqual(attrs, { customEmojiId: '9' });

        return {
          save: async () => {},
        };
      }
    }

    this.owner.register('service:current-user', CurrentUserStub);
    this.owner.register('service:session', SessionStub);
    this.owner.register('service:store', StoreStub);

    this.emojis = [
      {
        id: '9',
        name: 'dj_wave',
        imageUrl: 'https://example.com/dj_wave.png',
        user: {
          id: '2',
          username: 'cooldj',
        },
      },
    ];

    await render(hbs`<CustomEmoji::Gallery @emojis={{this.emojis}} @allowSave={{true}} />`);

    await click('[data-test-save-custom-emoji="9"]');

    assert.strictEqual(userEmojis.length, 1);
    assert.dom('[data-test-save-custom-emoji="9"]').isDisabled();
    assert.dom('[data-test-save-custom-emoji="9"]').hasText('Saved');
    assert.deepEqual(userEmojiRegistry[':dj_wave:'], {
      name: 'dj_wave',
      imageUrl: 'https://example.com/dj_wave.png',
    });
  });

  test('it shows saved state for emojis already in user-emojis', async function (assert) {
    class CurrentUserStub extends Service {
      user = {
        id: '1',
        userEmojis: [{ customEmojiId: '9' }],
      };
    }

    class SessionStub extends Service {
      isAuthenticated = true;
    }

    this.owner.register('service:current-user', CurrentUserStub);
    this.owner.register('service:session', SessionStub);

    this.emojis = [
      {
        id: '9',
        name: 'dj_wave',
        imageUrl: 'https://example.com/dj_wave.png',
        user: {
          id: '2',
          username: 'cooldj',
        },
      },
    ];

    await render(hbs`<CustomEmoji::Gallery @emojis={{this.emojis}} @allowSave={{true}} />`);

    assert.dom('[data-test-save-custom-emoji="9"]').isDisabled();
    assert.dom('[data-test-save-custom-emoji="9"]').hasText('Saved');
  });
});
