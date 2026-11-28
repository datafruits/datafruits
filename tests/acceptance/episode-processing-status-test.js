import { module, test } from 'qunit';
import { visit, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | episode processing status', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('processing status is not visible to unauthenticated users', async function (assert) {
    const episode = this.server.create('scheduled-show', {
      slug: 'test-episode',
      showSeriesSlug: 'test-series',
      status: 'archive_published',
      title: 'Test Episode'
    });

    await visit(`/shows/${episode.showSeriesSlug}/${episode.slug}`);

    const processingStatus = find('[data-test-processing-status]');
    assert.notOk(processingStatus, 'Processing status should not be visible to unauthenticated users');
  });
});