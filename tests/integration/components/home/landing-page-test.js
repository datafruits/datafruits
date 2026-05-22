import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';

import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | home/landing-page', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'en-us');

  test('it renders the redesigned homepage sections', async function (assert) {
    this.model = {
      upcomingShows: [
        { slug: 'show-1', formattedEpisodeTitle: 'Morning Melon', labels: [] },
        { slug: 'show-2', formattedEpisodeTitle: 'Night Pear', labels: [] },
      ],
      latestPodcasts: [
        { slug: 'podcast-1', formattedEpisodeTitle: 'Fruit FM Replay', labels: [] },
      ],
      latestPosts: [
        {
          slug: 'post-1',
          title: 'Welcome to the orchard',
          repliesCount: 4,
          posterUsername: 'ovenrake',
          posterAvatar: '/assets/images/strawberry.png',
          replyPosterAvatars: [],
        },
      ],
      latestWiki: [
        { slug: 'fruit-lore', title: 'Fruit Lore' },
      ],
      activeShrimpos: [
        {
          slug: 'shrimpo-1',
          title: 'Maximum Glorp',
          translatedStatus: 'Completed',
          entriesCount: 9,
          username: 'ovenrake',
          user: { avatarUrl: '/assets/images/futsu.png' },
        },
      ],
      latestYoutubeVideoId: 'abc123',
    };

    await render(hbs`<Home::LandingPage @model={{this.model}} />`);

    assert.dom('[data-test-home-hero]').exists();
    assert.dom('[data-test-home-hero]').includesText('fruit from the future, streaming now');
    assert.dom('[data-test-home-merch]').exists();
    assert.dom('[data-test-home-video]').exists();
    assert.dom('[data-test-home-panel="shows"]').exists();
    assert.dom('[data-test-home-panel="podcasts"]').exists();
    assert.dom('[data-test-home-panel="posts"]').exists();
    assert.dom('[data-test-home-panel="wiki"]').exists();
    assert.dom('[data-test-home-panel="chat"]').exists();
    assert.dom('[data-test-home-panel="shrimpo"]').exists();
    assert.dom(this.element).includesText('Morning Melon');
    assert.dom(this.element).includesText('Night Pear');
    assert.dom(this.element).includesText('Fruit FM Replay');
    assert.dom(this.element).includesText('Welcome to the orchard');
    assert.dom(this.element).includesText('CHAT');
    assert.dom(this.element).includesText('Maximum Glorp');
    assert.dom('.home-wiki-link').exists({ count: 1 });
  });

  test('it shows homepage empty states when sections have no data', async function (assert) {
    this.model = {
      upcomingShows: [],
      latestPodcasts: [],
      latestPosts: [],
      latestWiki: [],
      activeShrimpos: [],
      latestYoutubeVideoId: null,
    };

    await render(hbs`<Home::LandingPage @model={{this.model}} />`);

    assert.dom('[data-test-home-video]').doesNotExist();
    assert.dom('.home-panel__empty').exists({ count: 5 });
  });
});
