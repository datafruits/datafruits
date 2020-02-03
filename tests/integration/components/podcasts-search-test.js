import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | podcasts search', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  // Called live endpoints, should be a mirage test or better mocked
  skip('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('searchParams', {});
    this.set('tracks', []);
    this.set('labels', []);

    await render(hbs`<PodcastsSearch
      @tracks={{tracks}}
      @labels={{labels}}
      @searchParams={{searchParams}}
      />`);

    assert.dom('*').hasText('');
  });
});
