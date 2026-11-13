import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { Changeset } from 'ember-changeset';
import UserValidations from 'datafruits13/validations/user';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | sign-up/form', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    this.user = Changeset({}, UserValidations);

    await render(hbs`<SignUp::Form @changeset={{this.user}} />`);

    assert.true(this.element.textContent.includes('Email'));
    assert.true(this.element.textContent.includes('Password'));
    assert.true(this.element.textContent.includes('Username'));
  });

  test('a filled honeypot blocks submission before validation or saving', async function (assert) {
    this.user = {
      errors: [],
      get(key) {
        return this[key];
      },
      validate() {
        assert.step('validate');
        return Promise.resolve();
      },
      save() {
        assert.step('save');
      },
    };

    await render(hbs`<SignUp::Form @changeset={{this.user}} />`);

    const honeypot = this.element.querySelector('[name="website"]');
    assert.dom(honeypot).isNotVisible();
    assert.dom(honeypot).hasAttribute('tabindex', '-1');
    honeypot.value = 'https://spam.example';
    await triggerEvent('form', 'submit');

    assert.verifySteps([]);
  });
});
