import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import { fillIn, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | chat/input-message', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    assert.expect(2);
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`<Chat::InputMessage />`);

    assert.equal(this.element.querySelectorAll('#send-message-button').length, 0);

    await fillIn('#input-message', "musta been the onion salad dressing");

    assert.equal(this.element.querySelectorAll('#send-message-button').length, 1);
  });
});
