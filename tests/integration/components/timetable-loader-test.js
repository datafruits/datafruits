import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | timetable-loader', function (hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{timetable-loader}}`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      {{#timetable-loader}}
        template block text
      {{/timetable-loader}}
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
