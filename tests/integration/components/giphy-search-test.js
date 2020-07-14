import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | giphy-search', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('sendGif', () => {});

    await render(hbs`<GiphySearch @sendGif={{sendGif}} />`);

    assert.ok(this.element);
  });
});
