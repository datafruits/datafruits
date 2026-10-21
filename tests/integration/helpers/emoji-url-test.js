import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmojiService from 'datafruits13/services/emoji';

// Create a test subclass to prevent network fetches and manifest race conditions
class TestEmojiService extends EmojiService {
  loadManifest() {
    this.isLoaded = true;
  }
}

module('Integration | Helper | emoji-url', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:emoji', TestEmojiService);
  });

  test('it renders', async function (assert) {
    let emojiService = this.owner.lookup('service:emoji');
    emojiService.emojiMap.set('1f33c', { file: '1f33c.png' });
    emojiService.emojiMap.set('onion_salad_dressing', { file: 'onion_salad_dressing.gif' });

    this.set('inputValue', '1f33c');
    await render(hbs`{{emoji-url this.inputValue}}`);
    assert.dom(this.element).hasText('/emoji-zone/1f33c.png');

    this.set('inputValue', 'onion_salad_dressing');
    await render(hbs`{{emoji-url this.inputValue}}`);
    assert.dom(this.element).hasText('/emoji-zone/onion_salad_dressing.gif');
  });
});