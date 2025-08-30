import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | podcast track', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('track', {
      cdnUrl: 'http://cdn.dongles.net/track.mp3',
      title: 'cool track 12122024',
    });

    this.set('show', {
      thumbImageUrl: 'https://dongles.com/cat.png',
      title: 'cool track',
      formattedEpisodeTitle: 'cool track 12122024'
    });

    await render(hbs`<PodcastTrack
      @track={{this.track}}
      @show={{this.show}}
    />`);

    assert.true(this.element.textContent.trim().includes('▶︎'));
    assert.true(this.element.textContent.trim().includes('cool track 12122024'));
  });
});
