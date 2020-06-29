import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

const metadataStub = Service.extend({});

module('Integration | Component | datafruits player', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:metadata', metadataStub);
  });

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('nextShow', { title: 'vampire disco 3000' });

    await render(hbs`{{datafruits-player nextShow=nextShow}}`);

    assert.dom('#next-show').hasText('Next live on air: vampire disco 3000');
  });
});
