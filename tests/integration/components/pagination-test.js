import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pagination', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.meta = { page: 1, total_pages: 10 };
    this.route = 'home.djs';

    await render(
      hbs`<Pagination @totalPages={{this.meta.total_pages}} @page={{this.meta.page}} @route={{this.route}} />`,
    );

    assert.dom(this.element).hasText('1 2 3 4 5 6 7 8 9 10 »');
  });
});
