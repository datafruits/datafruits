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

  test('processing status is visible to host DJ', async function (assert) {
    // Create a user (DJ)
    const user = this.server.create('user', {
      username: 'testdj',
      id: '1'
    });

    // Create episode with the user as host
    const episode = this.server.create('scheduled-show', {
      slug: 'test-episode',
      showSeriesSlug: 'test-series',
      status: 'archive_published',
      title: 'Test Episode',
      hosts: ['testdj']
    });

    // Mock authentication
    this.owner.lookup('service:session').set('isAuthenticated', true);
    this.owner.lookup('service:session').set('data', {
      authenticated: { id: '1' }
    });
    this.owner.lookup('service:current-user').set('user', user);

    await visit(`/shows/${episode.showSeriesSlug}/${episode.slug}`);

    const processingStatus = find('h3:contains("Processing Status")');
    assert.ok(processingStatus, 'Processing status should be visible to host DJ');
  });

  test('processing status shows archive status correctly', async function (assert) {
    // Create a user (DJ)
    const user = this.server.create('user', {
      username: 'testdj',
      id: '1'
    });

    // Create episode with published status
    const episode = this.server.create('scheduled-show', {
      slug: 'test-episode',
      showSeriesSlug: 'test-series',
      status: 'archive_published',
      title: 'Test Episode',
      hosts: ['testdj']
    });

    // Mock authentication
    this.owner.lookup('service:session').set('isAuthenticated', true);
    this.owner.lookup('service:session').set('data', {
      authenticated: { id: '1' }
    });
    this.owner.lookup('service:current-user').set('user', user);

    await visit(`/shows/${episode.showSeriesSlug}/${episode.slug}`);

    assert.dom('[data-test-archive-status]').containsText('Published');
  });
});