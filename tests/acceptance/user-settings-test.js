import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user settings', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /user-settings', async function (assert) {
    await visit('/user/settings');

    assert.equal(currentURL(), '/user/settings');
  });
});
