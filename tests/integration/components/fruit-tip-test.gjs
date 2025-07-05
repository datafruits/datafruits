import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import FruitTip from "../../../app/components/fruit-tip.gts";

module('Integration | Component | fruit-tip', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(<template><FruitTip /></template>);

    // TODO construct this string dynamically
    assert.dom(this.element).hasText('Lv. 3 Lv. 4 Lv. 5 Lv. 6 Lv. 7 Lv. 8 Ƒ200 Ƒ400 Ƒ500 Ƒ1000 Ƒ1200');
  });

  skip('it shows fruit tipping options when clicked', async function (/*assert*/) {
    await render(<template><FruitTip /></template>);
    click('button');
  });
});
