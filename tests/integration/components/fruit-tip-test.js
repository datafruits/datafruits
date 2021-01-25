import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | fruit-tip', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<FruitTip />`);

    assert.equal(this.element.textContent.trim(), '');
  });

  // test('it shows fruit tipping options when clicked', async function (assert) {
  //   await render(hbs`<FruitTip />`);
  //   click('button');
  // });
});
