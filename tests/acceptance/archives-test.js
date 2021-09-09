import { module, test, skip } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | archives', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /podcasts', async function (assert) {
    await visit('/podcasts');

    assert.equal(currentURL(), '/podcasts');
  });

  skip('search by freetext', async function (assert) {
    // changes query param and updates search
  });

  skip('search by selecting a tag in the dropdown', async function (assert) {});

  skip('search by clicking a tag', async function (assert) {});
});
