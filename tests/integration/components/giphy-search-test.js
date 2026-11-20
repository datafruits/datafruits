import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | giphy-search', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    this.set('sendGif', () => {});

    await render(hbs`<GiphySearch @sendGif={{this.sendGif}} />`);

    assert.ok(this.element);
  });

  test('shows a failed search message and clears it on recovery or provider change', async function (assert) {
    const store = this.owner.lookup('service:store');
    store.query = async (_model, { query, provider }) => {
      if (provider === 'gifcities' && query === 'pizza') {
        throw new Error('Service unavailable');
      }
      return [];
    };

    await render(hbs`<GiphySearch />`);
    await click('input[value="gifcities"]');
    await fillIn('#giphy-search-term', 'pizza');
    assert.dom('[role="alert"]').hasText('Gifcities search failed. Please try again.');
    assert.dom('.gif-button').doesNotExist();

    await fillIn('#giphy-search-term', 'cats');
    assert.dom('[role="alert"]').doesNotExist();

    await fillIn('#giphy-search-term', 'pizza');
    assert.dom('[role="alert"]').exists();
    await click('input[value="giphy"]');
    assert.dom('[role="alert"]').doesNotExist();
  });

  test('switches providers and sends the selected Gifcities result', async function (assert) {
    const gif = { url: 'http://localhost:4000/images/pizza.gif', previewUrl: '/pizza.gif' };
    const store = this.owner.lookup('service:store');
    store.query = async (model, query) => {
      assert.step(`${model}:${query.provider || 'giphy'}:${query.query}`);
      return [gif];
    };
    this.set('sendGif', (selected) => assert.strictEqual(selected, gif));

    await render(hbs`<GiphySearch @sendGif={{this.sendGif}} />`);
    assert.dom('input[value="giphy"]').isChecked();
    await fillIn('#giphy-search-term', 'pizza');
    await click('#stickers');
    await click('input[value="gifcities"]');
    assert.dom('#stickers').doesNotExist();
    assert.dom('.gif-preview').hasAttribute('src', '/pizza.gif');
    await click('.gif-button');
    await click('input[value="giphy"]');
    assert.dom('#gifs').isChecked();
    await fillIn('#giphy-search-term', '');
    assert.dom('.gif-button').doesNotExist();
    assert.verifySteps([
      'gif:giphy:pizza',
      'sticker:giphy:pizza',
      'gif:gifcities:pizza',
      'gif:giphy:pizza',
    ]);
  });
});
