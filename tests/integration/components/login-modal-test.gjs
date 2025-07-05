import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import LoginModal from "../../../app/components/login-modal.js";

module('Integration | Component | login-modal', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.login = () => {};
    this.toggleModal = () => {};
    await render(<template>
      <div id="modals-container"></div>
      <LoginModal @login={{self.login}} @toggleModal={{self.toggleModal}} />
      </template>);

    assert.true(this.element.textContent.trim().includes('Login'));
  });
});
