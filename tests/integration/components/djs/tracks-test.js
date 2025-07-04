import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | djs/tracks', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    //
    this.page = '1';

    this.dj = {
      id: 1,
    };

    await render(hbs`<Djs::Tracks @dj={{this.dj}} @page={{this.page}} `);

    assert.equal(this.element.textContent.trim(), '');
  });
});
