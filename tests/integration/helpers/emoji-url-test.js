import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | emoji-url', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {

    this.set('inputValue', {
      unicode: '1f33c'
    });

    await render(hbs`{{emoji-url this.inputValue}}`);

    assert.dom(this.element).hasText('https://cdn.jsdelivr.net/emojione/assets/4.0/png/32/1f33c.png');

    this.set('inputValue', {
      unicode: 'onion_salad_dressing',
      animated: true,
      custom: true
    });

    await render(hbs`{{emoji-url this.inputValue}}`);

    assert.dom(this.element).hasText('/assets/images/emojis/onion_salad_dressing.gif');
  });
});
