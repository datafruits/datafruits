import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | datafruits chat', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{datafruits-chat}}`);

    assert.dom('*').hasText('Join chatroom');
  });

  test('it has offline message', async function(assert) {
    await render(hbs`{{datafruits-chat}}`);

    assert.dom('*').hasText("You appear to be offline. I guess you won't be able to chat. Musta been the onion salad dressing Join chatroom");
  });
});
