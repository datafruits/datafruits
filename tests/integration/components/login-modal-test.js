import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | login-modal', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.login = () => {};
    this.toggleModal = () => {};
    await render(hbs`<LoginModal @login={{this.login}} @toggleModal={{this.toggleModal}} />`);

    assert.true(this.element.textContent.trim().includes('Login'));
  });
});
