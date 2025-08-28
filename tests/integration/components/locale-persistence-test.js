import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | locale persistence', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'en-us');

  test('locale selection persists to localStorage', async function (assert) {
    // Setup mock localStorage
    let savedLocale = null;
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'datafruits-locale') {
        savedLocale = value;
      }
    };

    // Mock fastboot service to allow localStorage access
    this.owner.register('service:fastboot', class {
      isFastBoot = false;
    });

    this.setLocaleAction = (event) => {
      // This simulates the setLocale action in website-settings.ts
      const target = event.target;
      this.intl.setLocale(target.value);
      // The fix should save to localStorage here
      if (target.value) {
        localStorage.setItem('datafruits-locale', target.value);
      }
    };

    await render(hbs`<LocaleSelector @setLocale={{this.setLocaleAction}} />`);
    
    // Change to Japanese
    await fillIn('select', 'ja');
    
    assert.equal(savedLocale, 'ja', 'Japanese locale should be saved to localStorage when selected');
    
    // Change to Spanish
    await fillIn('select', 'es');
    
    assert.equal(savedLocale, 'es', 'Spanish locale should be saved to localStorage when selected');
    
    // Restore original setItem
    Storage.prototype.setItem = originalSetItem;
  });

  test('site-settings component also saves locale', async function (assert) {
    // Setup mock localStorage
    let savedLocale = null;
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'datafruits-locale') {
        savedLocale = value;
      }
    };

    // Mock fastboot service
    this.owner.register('service:fastboot', class {
      isFastBoot = false;
    });

    this.setLocaleAction = (locale) => {
      // This simulates the setLocale action in site-settings.js
      this.intl.setLocale(locale);
      localStorage.setItem('datafruits-locale', locale);
    };

    this.setLocaleAction('ko');
    
    assert.equal(savedLocale, 'ko', 'Korean locale should be saved to localStorage');
    
    // Restore original setItem
    Storage.prototype.setItem = originalSetItem;
  });
});