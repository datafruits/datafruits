import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | chat', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /chat', async function(assert) {
    await visit('/chat');

    assert.equal(currentURL(), '/chat');
  });
});
