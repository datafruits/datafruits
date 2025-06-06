import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | fruit-tip', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<FruitTip />`);

    assert.dom(this.element).hasText('Lv. 3 Lv. 4 Lv. 5 Lv. 6 Lv. 7 Ƒ200 Ƒ400 Ƒ500 Ƒ1000 Ƒ1200');
  });

  skip('it shows fruit tipping options when clicked', async function (/*assert*/) {
    await render(hbs`<FruitTip />`);
    click('button');
  });
});
