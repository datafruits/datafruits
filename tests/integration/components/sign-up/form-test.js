import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { Changeset } from 'ember-changeset';
import UserValidations from 'datafruits13/validations/user';

module('Integration | Component | sign-up/form', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.user = Changeset({}, UserValidations);

    await render(hbs`<SignUp::Form @changeset={{this.user}} />`);

    assert.true(this.element.textContent.includes('Email'));
    assert.true(this.element.textContent.includes('Password'));
    assert.true(this.element.textContent.includes('Username'));
  });
});
