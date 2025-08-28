import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | shrimpos', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /shrimpos/new without authentication redirects', async function (assert) {
    await visit('/shrimpos/new');

    // The route should redirect unauthenticated users
    // Let's see what the actual behavior is
    assert.ok(currentURL() !== '/shrimpos/new', 'Should redirect unauthenticated users');
  });
});