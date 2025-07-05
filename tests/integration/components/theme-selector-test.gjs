import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import ThemeSelector from "../../../app/components/theme-selector.js";

module('Integration | Component | theme-selector', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    this.setThemeTest = () => {};
    await render(<template><ThemeSelector @setTheme={{self.setThemeTest}} /></template>);
    assert.true(this.element.textContent.trim().includes('its just a website'));
  });
});
