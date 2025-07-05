import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import myShowsRecordingsSearch from "../../../../app/components/my-shows/recordings-search.gts";

module('Integration | Component | my-shows/recordings-search', function(hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(<template>{{myShowsRecordingsSearch}}</template>);

    assert.equal(this.element?.textContent?.trim(), '');
  });
});
