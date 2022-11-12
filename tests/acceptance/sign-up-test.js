import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | sign up', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /sign-up', async function (assert) {
    window.alert = () => {};
    await visit('/sign-up');

    assert.equal(currentURL(), '/sign-up');

    await fillIn('[data-test-username]', 'djnameko');
    await fillIn('[data-test-email]', 'dj.nameko@datafruits.fm');
    await fillIn('[data-test-password]', 'mypassword1234');
    await click('[data-test-age]');
    await click('[data-test-coc]');
    await click('[data-test-submit]');

    assert.equal(currentURL(), '/chat');
  });
});
