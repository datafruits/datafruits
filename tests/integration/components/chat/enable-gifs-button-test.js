import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | chat/enable-gifs-button', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    this.toggleGifs = function () {};
    this.gifsEnabled = true;

    await render(
      hbs`<Chat::EnableGifsButton @toggleGifs={{this.toggleGifs}} @enabled={{this.gifsEnabled}} />`,
    );

    assert
      .dom(this.element.querySelector("#gif-enabler"))
      .isChecked("GIF enabler should be checked by default");

  });
});
