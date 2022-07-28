import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | podcast track', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('track', {
      cdnUrl: 'http://cdn.dongles.net/track.mp3',
      title: 'cool track',
    });

    await render(hbs`<PodcastTrack @track={{this.track}} />`);

    assert.true(this.element.textContent.trim().includes('▶︎'));
    assert.true(this.element.textContent.trim().includes('cool track'));
  });
});
