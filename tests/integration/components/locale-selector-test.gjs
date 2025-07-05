import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import { setupIntl } from 'ember-intl/test-support';
import LocaleSelector from "../../../app/components/locale-selector.js";

module('Integration | Component | locale selector', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {const self = this;

    this.set('setLocaleAction', () => {});

    await render(<template><LocaleSelector @setLocale={{self.setLocaleAction}} /></template>);

    assert.true(this.element.textContent.trim().includes('English'));
    assert.true(this.element.textContent.includes('日本語'));
    assert.true(this.element.textContent.includes('한국어'));
    assert.true(this.element.textContent.includes('Español'));
  });

  test('it calls passed in setLocale action', async function (assert) {const self = this;

    assert.expect(1);

    this.set('setLocaleAction', (actual) => {
      let expected = 'ko';
      assert.equal(actual.target.value, expected, 'selected locale is passed to setLocale action');
    });

    await render(<template><LocaleSelector @setLocale={{self.setLocaleAction}} /></template>);

    await fillIn('select', 'ko');
  });
});
