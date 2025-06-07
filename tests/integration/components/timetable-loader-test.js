import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | timetable-loader', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  skip('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{timetable-loader}}`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <TimetableLoader>
        template block text
      </TimetableLoader>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
