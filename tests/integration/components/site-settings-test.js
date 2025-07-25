import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | site-settings', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<SiteSettings />`);

    assert.true(this.element.textContent.trim().includes('its just a website'));
    assert.true(this.element.textContent.trim().includes('English'));
    assert.true(this.element.textContent.includes('日本語'));
    assert.true(this.element.textContent.includes('한국어'));
    assert.true(this.element.textContent.includes('Español'));
  });
});
