import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user settings', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /user-settings', async function (assert) {
    window.alert = () => {};

    await visit('/chat');
    await click('[data-test-login-button]');

    await fillIn('[data-test-username]', 'djnameko');
    await fillIn('[data-test-password]', 'mypassword1234');

    await click('[data-test-login-submit]');

    assert.equal(currentURL(), '/chat');

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
