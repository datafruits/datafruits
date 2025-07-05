import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { Changeset } from 'ember-changeset';
import UserValidations from 'datafruits13/validations/user';
import { setupIntl } from 'ember-intl/test-support';
import Form from "../../../../app/components/sign-up/form.js";

module('Integration | Component | sign-up/form', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    this.user = Changeset({}, UserValidations);

    await render(<template><Form @changeset={{self.user}} /></template>);

    assert.true(this.element.textContent.includes('Email'));
    assert.true(this.element.textContent.includes('Password'));
    assert.true(this.element.textContent.includes('Username'));
  });
});
