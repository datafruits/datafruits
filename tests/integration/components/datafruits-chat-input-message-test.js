import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | datafruits chat input message', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(2);
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{datafruits-chat-input-message}}`);

    assert.true(this.element.textContent.trim().includes('Send'));
    assert.true(this.element.textContent.trim().includes('GIF'));
  });
});
