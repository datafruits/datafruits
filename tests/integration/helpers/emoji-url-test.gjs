import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import emojiUrl from "../../../app/helpers/emoji-url.js";

module('Integration | Helper | emoji-url', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {const self = this;

    this.set('inputValue', {
      unicode: '1f33c',
    });

    await render(<template>{{emojiUrl self.inputValue}}</template>);

    assert.dom(this.element).hasText('https://cdn.jsdelivr.net/emojione/assets/4.0/png/32/1f33c.png');

    this.set('inputValue', {
      unicode: 'onion_salad_dressing',
      animated: true,
      custom: true,
    });

    await render(<template>{{emojiUrl self.inputValue}}</template>);

    assert.dom(this.element).hasText('/assets/images/emojis/onion_salad_dressing.gif');
  });
});
