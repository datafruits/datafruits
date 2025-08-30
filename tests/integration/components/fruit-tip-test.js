import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupIntl } from 'ember-intl/test-support';
import fruitTypes from 'datafruits13/fruit-types';

function generateExpectedFruitTipText() {
  const levelTexts = [];
  const costTexts = [];
  
  fruitTypes.forEach(fruit => {
    if (fruit.levelReq > 0) {
      levelTexts.push(`Lv. ${fruit.levelReq}`);
    }
    if (fruit.cost > 0) {
      costTexts.push(`Ƒ${fruit.cost}`);
    }
  });
  
  return [...levelTexts, ...costTexts].join(' ');
}

module('Integration | Component | fruit-tip', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<FruitTip />`);

    // Generate expected text dynamically from fruit types
    const expectedText = generateExpectedFruitTipText();
    assert.dom(this.element).hasText(expectedText);
  });

  skip('it shows fruit tipping options when clicked', async function (/*assert*/) {
    await render(hbs`<FruitTip />`);
    click('button');
  });
});
