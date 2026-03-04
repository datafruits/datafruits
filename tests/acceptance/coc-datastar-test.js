import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | coc datastar', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /coc-datastar renders the Datastar demo page', async function (assert) {
    await visit('/coc-datastar');

    assert.equal(currentURL(), '/coc-datastar');
    assert.dom('[data-test-datastar-root]').exists('Datastar root element is present');
  });
});
