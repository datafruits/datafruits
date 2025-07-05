import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import labelsSelect from "../../../app/components/labels-select.gts";

module('Integration | Component | labels-select', function(hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(<template>{{labelsSelect}}</template>);

    assert.equal(this.element?.textContent?.trim(), 'Tags');
  });
});
