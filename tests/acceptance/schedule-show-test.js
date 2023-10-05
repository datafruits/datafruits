import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | schedule show', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('schedule new show series', async function (assert) {
    window.alert = () => {};

    await visit('/chat');
    await click('[data-test-login-button]');

    await fillIn('[data-test-username]', 'djnameko');
    await fillIn('[data-test-password]', 'mypassword1234');

    await click('[data-test-login-submit]');

    assert.equal(currentURL(), '/chat');

    await visit('/user/my-shows/');
    await fillIn('', 'test');
  });

  // test one off
  // test weekly
  // test biweekly
  // test monthly
});
