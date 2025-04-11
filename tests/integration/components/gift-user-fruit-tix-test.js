import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | gift-user-fruit-tix', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('user', { id: 2, username: 'garfield' });

    await render(hbs`<GiftUserFruitTix @toUser={{this.user}} />`);

    assert.equal(this.element.textContent?.trim(), 'Send Gift Ƒ');
  });
});
