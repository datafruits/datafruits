import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

import { setupIntl } from 'ember-intl/test-support';

const videoStreamStub = class VideoStreamStub extends Service {
  active = true;
  initializePlayer() {}
  fetchStream() {}
};

module('Integration | Component | datafruits visuals', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  hooks.beforeEach(function () {
    this.owner.register('service:video-stream', videoStreamStub);
  });

  test('it renders video if stream is active', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`<DatafruitsVisuals />`);

    assert.equal(this.element.querySelectorAll('video').length, 1);
  });
});
