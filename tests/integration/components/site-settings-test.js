import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | site-settings', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<SiteSettings />`);

    assert.equal(this.element.textContent.trim().includes('its just a website'), true);
    assert.equal(this.element.textContent.trim().includes('English'), true);
    assert.equal(this.element.textContent.includes('日本語'), true);
    assert.equal(this.element.textContent.includes('한국어'), true);
    assert.equal(this.element.textContent.includes('Español'), true);
  });
});
