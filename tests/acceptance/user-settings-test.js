import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | user settings', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /user-settings', async function (assert) {
    window.alert = () => {};

    await authenticateSession({
      username: 'djnameko',
      password: '12345',
    });
    await visit('/login');

    await visit('/user/settings');

    // upload photo
    // change style
    await click('[data-test-submit]');

    assert.equal(currentURL(), '/user/settings');
  });

  test('redirects to chat if not logged in', async function (assert) {
    await visit('/user/settings');

    assert.equal(currentURL(), '/chat');
  });
});
