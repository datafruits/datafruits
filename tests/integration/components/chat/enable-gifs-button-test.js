import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | chat/enable-gifs-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.toggleGifs = function () {};

    await render(hbs`<Chat::EnableGifsButton @toggleGifs={{this.toggleGifs}} />`);

    const emoji = this.element.querySelector('img.emojione');
    assert.dom(emoji).hasNoAttribute('title')
  });
});
