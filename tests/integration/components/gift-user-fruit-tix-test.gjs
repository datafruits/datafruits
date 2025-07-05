import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import GiftUserFruitTix from "../../../app/components/gift-user-fruit-tix.gts";

module('Integration | Component | gift-user-fruit-tix', function(hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function(assert) {const self = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('user', { id: 2, username: 'garfield' });

    await render(<template><GiftUserFruitTix @toUser={{self.user}} /></template>);

    assert.equal(this.element.textContent?.trim(), 'Send Gift Ƒ');
  });
});
