import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import { registerUserEmoji, clearUserEmojis } from 'datafruits13/utils/user-emoji-registry';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | emoji-selector/emoji', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  hooks.beforeEach(function () {
    class ChatStub extends Service {
      recentEmojis = [];
    }

    this.owner.register('service:chat', ChatStub);
  });

  hooks.afterEach(function () {
    clearUserEmojis();
  });

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<EmojiSelector::Emoji />`);

    assert.dom(this.element).hasText('');
  });

  test('it includes saved user emojis', async function (assert) {
    registerUserEmoji('dj_wave', 'https://example.com/dj_wave.png');

    await render(hbs`<EmojiSelector::Emoji />`);

    assert.dom('img[src="https://example.com/dj_wave.png"]').exists();
  });
});
