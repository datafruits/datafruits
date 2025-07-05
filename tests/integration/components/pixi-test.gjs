import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import Pixi from "../../../app/components/pixi.js";

module('Integration | Component | pixi', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  skip('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(<template><Pixi /></template>);

    assert.dom(this.element).hasText('');
  });
});
