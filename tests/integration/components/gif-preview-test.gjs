import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import GifPreview from "../../../app/components/gif-preview.gts";

module('Integration | Component | gif-preview', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    assert.expect(2);
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('gif', { name: 'test', previewUrl: 'test.gif' });
    this.set('sendGif', (actual) => {
      let expected = this.gif;
      assert.deepEqual(actual, expected, 'gif is passed to sendGif action');
    });

    await render(<template><GifPreview @gif={{self.gif}} @sendGif={{self.sendGif}} /></template>);

    assert.equal(this.element.querySelector('img').getAttribute('src'), this.gif.previewUrl);

    await click('.gif-button');
  });
});
