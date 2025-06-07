import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | locale selector', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    this.set('setLocaleAction', () => {});

    await render(hbs`<LocaleSelector @setLocale={{this.setLocaleAction}} />`);

    assert.true(this.element.textContent.trim().includes('English'));
    assert.true(this.element.textContent.includes('日本語'));
    assert.true(this.element.textContent.includes('한국어'));
    assert.true(this.element.textContent.includes('Español'));
  });

  test('it calls passed in setLocale action', async function (assert) {
    assert.expect(1);

    this.set('setLocaleAction', (actual) => {
      let expected = 'ko';
      assert.equal(actual.target.value, expected, 'selected locale is passed to setLocale action');
    });

    await render(hbs`<LocaleSelector @setLocale={{this.setLocaleAction}} />`);

    await fillIn('select', 'ko');
  });
});
