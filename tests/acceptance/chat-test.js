import { module, skip } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | chat', function (hooks) {
  setupApplicationTest(hooks);

  // TODO need to mock websockets request somehow...
  skip('visiting /chat', async function (assert) {
    await visit('/chat');

    assert.equal(currentURL(), '/chat');
  });
});
