import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import trackUploader from "../../../app/components/track-uploader.gts";

module('Integration | Component | track-uploader', function(hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(<template>{{trackUploader}}</template>);

    assert.equal(this.element.textContent?.trim(), 'Choose a file');
  });
});
