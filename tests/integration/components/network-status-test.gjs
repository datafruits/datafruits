import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import NetworkStatus from "../../../app/components/network-status.js";

module('Integration | Component | network-status', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(<template><NetworkStatus /></template>);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(<template>
      <NetworkStatus>
        template block text
      </NetworkStatus>
    </template>);

    assert.dom(this.element).hasText('template block text');
  });
});
