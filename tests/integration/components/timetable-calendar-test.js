import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | timetable calendar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(0);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{timetable-calendar}}`);

    //assert.equal(this.$().text().trim(), '');
  });
});
