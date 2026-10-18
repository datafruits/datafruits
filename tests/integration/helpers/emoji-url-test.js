import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | emoji-url', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    let emojiZone = this.owner.lookup('service:emoji-zone');
    emojiZone.emojiMap.set('1f33c', { file: '1f33c.png' });
    emojiZone.emojiMap.set('onion_salad_dressing', { file: 'onion_salad_dressing.gif' });

    this.set('inputValue', '1f33c');
    await render(hbs`{{emoji-url this.inputValue}}`);
    assert.dom(this.element).hasText('/emoji-zone/1f33c.png');

    this.set('inputValue', 'onion_salad_dressing');
    await render(hbs`{{emoji-url this.inputValue}}`);
    assert.dom(this.element).hasText('/emoji-zone/onion_salad_dressing.gif');
  });
});