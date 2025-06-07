import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | show-card', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    let start = new Date(2021, 9, 20, 19, 0, 0);
    this.show = { title: 'shrimpshake', start: start, thumbImageUrl: 'cat.png' };
    await render(hbs`<ShowCard @showSeries={{this.show}} />`);

    assert.dom(this.element).includesText('shrimpshake');
  });
});
