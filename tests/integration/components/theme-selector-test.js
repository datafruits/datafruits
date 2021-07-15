import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | theme-selector', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.setThemeTest = () => {};
    await render(hbs`<ThemeSelector @setTheme={{this.setThemeTest}}/>`);
    assert.true(this.element.textContent.trim().includes('its just a website'));
  });
});
