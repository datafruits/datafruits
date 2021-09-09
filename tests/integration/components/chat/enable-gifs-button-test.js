import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | chat/enable-gifs-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    //
    this.toggleGifs = function () {};

    await render(hbs`<Chat::EnableGifsButton @toggleGifs={{this.toggleGifs}} />`);

    assert.dom(this.element).hasText('Images are off');
  });
});
