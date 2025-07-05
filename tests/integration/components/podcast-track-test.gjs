import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import PodcastTrack from "../../../app/components/podcast-track.js";

module('Integration | Component | podcast track', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('track', {
      cdnUrl: 'http://cdn.dongles.net/track.mp3',
      title: 'cool track',
    });

    this.set('show', {
      thumbImageUrl: 'https://dongles.com/cat.png',
      title: 'cool track',
      formattedEpisodeTitle: 'cool track 12122024'
    });

    await render(<template><PodcastTrack @track={{self.track}} @show={{self.show}} /></template>);

    assert.true(this.element.textContent.trim().includes('▶︎'));
    assert.true(this.element.textContent.trim().includes('cool track 12122024'));
  });
});
