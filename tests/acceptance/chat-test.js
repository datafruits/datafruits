import { module, test, skip } from 'qunit';
import { visit, currentURL, fillIn, click, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | chat', function (hooks) {
  setupApplicationTest(hooks);

  // TODO need to mock websockets request somehow...
  skip('visiting /chat', async function (assert) {
    await visit('/chat');

    assert.equal(currentURL(), '/chat');
  });

  skip('login to the chat', async function (assert) {
    await visit('/chat');
    await click('[data-test-login-button]');

    await fillIn('[data-test-username]', 'djnameko');
    await fillIn('[data-test-password]', 'mypassword1234');

    await click('[data-test-login-submit]');

    assert.equal(currentURL(), '/chat');
    assert.equal(find('[data-test-chat-input-messsage]').length, 1);
  });
});
