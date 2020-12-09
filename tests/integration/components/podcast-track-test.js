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
    this.set('cdn_url', 'http://cdn.dongles.net/track.mp3');
    this.set('title', 'cool track');

    await render(hbs`{{podcast-track cdn_url=cdn_url title=title}}`);

    assert.equal(this.element.textContent.trim().includes('▶︎'), true);
    assert.equal(this.element.textContent.trim().includes('cool track'), true);
  });
});
