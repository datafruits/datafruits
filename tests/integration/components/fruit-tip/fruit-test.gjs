import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import Fruit from "../../../../app/components/fruit-tip/fruit.gts";

module('Integration | Component | fruit-tip/fruit', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.fruitTip = function () {};
    this.fruit = {};

    await render(<template><Fruit @fruitTip={{self.fruitTip}} @fruit={{self.fruit}} /></template>);

    assert.dom(this.element).hasText('');
  });
});
