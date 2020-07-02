import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | gif-preview', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set("gif", { name: "test", previewUrl: "test.gif" });
    this.set("sendGif", (actual) => {
      let expected = this.gif;
      assert.deepEqual(actual, expected, "gif is passed to sendGif action");
    });

    await render(hbs`<GifPreview @gif={{this.gif}} @sendGif={{this.sendGif}}/>`);

    assert.equal(this.element.querySelector('img').getAttribute('src'), this.gif.previewUrl);

    await click(".gif-button");

  });
});
