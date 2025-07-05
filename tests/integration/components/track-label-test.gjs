import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import TrackLabel from "../../../app/components/track-label.gts";

module('Integration | Component | track-label', function(hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function(assert) {const self = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('label', { name: 'italo' });

    await render(<template><TrackLabel @label={{self.label}} /></template>);

    assert.equal(this.element.textContent?.trim(), 'italo');
  });
});
