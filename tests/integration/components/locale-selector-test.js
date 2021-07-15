import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | locale selector', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('setLocaleAction', () => {});

    await render(hbs`<LocaleSelector @setLocale={{action setLocaleAction}} />`);

    assert.true(this.element.textContent.trim().includes('English'));
    assert.true(this.element.textContent.includes('日本語'));
    assert.true(this.element.textContent.includes('한국어'));
    assert.true(this.element.textContent.includes('Español'));
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
