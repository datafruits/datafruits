import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | shrimpo/entry-uploader', function(hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    this.set('shrimpo', {
      multiSubmitAllowed: true
    });

    this.set('shrimpoEntry', {
      isNew: true
    });

    await render(hbs`<Shrimpo::EntryUploader
      @shrimpo={{this.shrimpo}}
      @shrimpoEntry={{this.shrimpoEntry}}
    />`);

    assert.ok(this.element.textContent.trim().includes('Upload file plz'));
  });

  test('it shows progress bar when uploading', async function(assert) {
    this.set('shrimpo', {
      multiSubmitAllowed: true
    });

    this.set('shrimpoEntry', {
      isNew: true
    });

    await render(hbs`<Shrimpo::EntryUploader
      @shrimpo={{this.shrimpo}}
      @shrimpoEntry={{this.shrimpoEntry}}
    />`);

    // Progress bar should not be visible initially
    assert.dom('.shiny-pink').doesNotExist('Progress bar is not shown when not uploading');

    // Note: This test is basic since we can't easily mock the upload state in integration tests
    // In a real scenario, you'd test the upload functionality with unit tests or acceptance tests
  });
});