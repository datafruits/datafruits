import { module, test, skip } from 'qunit';
import { visit, currentURL, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | chat', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  // TODO need to mock websockets request somehow...
  skip('visiting /chat', async function (assert) {
    await visit('/chat');

    assert.equal(currentURL(), '/chat');
  });

  test('login to the chat', async function (assert) {
    await visit('/chat');
    await click('Login');

    await fillIn('[data-test-username]', 'djnameko');
    await fillIn('[data-test-password]', 'mypassword1234');

    await click('[data-test-submit]');

    assert.equal(currentURL(), '/chat');
  });
});
