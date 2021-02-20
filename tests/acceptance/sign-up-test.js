import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | sign up', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /sign-up', async function(assert) {
    await visit('/sign-up');

    assert.equal(currentURL(), '/sign-up');

    await fillIn("input#username", "djnameko");
    await fillIn("input#email", "dj.nameko@datafruits.fm");
    await fillIn("input#password", "mypassword1234");
    await click("[data-test-submit-button]");

    assert.equal(currentURL(), '/chat');
  });
});
