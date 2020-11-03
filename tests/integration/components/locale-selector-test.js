import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | locale selector', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('setLocaleAction', () => {});

    await render(hbs`<LocaleSelector @setLocale={{action setLocaleAction}} />`);

    assert.equal(this.element.textContent.trim().includes('English'), true);
    assert.equal(this.element.textContent.includes('日本語'), true);
    assert.equal(this.element.textContent.includes('한국어'), true);
    assert.equal(this.element.textContent.includes('Español'), true);
  });

  test('it calls passed in setLocale action', async function (assert) {
    this.set('setLocaleAction', (actual) => {
      let expected = 'ko';
      assert.equal(actual, expected, 'selected locale is passed to setLocale action');
    });

    await render(hbs`<LocaleSelector @setLocale={{action setLocaleAction}} />`);

    await fillIn('select', 'ko');
  });
});
