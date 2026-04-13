import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';
import { hash } from 'rsvp';
import dayjs from 'dayjs';

export default class IndexRoute extends Route {
  @service fastboot;
  @service store;

  async fetchLatestYoutubeVideoId() {
    if (!ENV.GOOGLE_API_KEY || !ENV.YOUTUBE_CHANNEL_ID) {
      return null;
    }
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${ENV.YOUTUBE_CHANNEL_ID}&maxResults=1&order=date&type=video&key=${ENV.GOOGLE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }
    return null;
  }

  async model() {
    let query = {
      start: dayjs().format('YYYY-MM-DD HH:MM Z'),
      end: dayjs().endOf('month').add(1, 'month').format('YYYY-MM-DD'),
    };
    return hash({
      upcomingShows: this.store.query('scheduled-show', query).then((shows) => {
        return shows.slice(0, 3);
      }),
      latestPodcasts: this.store.query('podcast', {
      }).then((podcasts) => {
        return podcasts.slice(0, 3);
      }),
      activeShrimpos: this.store.findAll('shrimpo').then((shrimpos) => {
        return shrimpos.filter((shrimpo) => {
          return !shrimpo.isNew && shrimpo.status === 'completed';
        }).sort((a, b) => new Date(b.endedAt ?? 0).getTime() - new Date(a.endedAt ?? 0).getTime())
        .slice(0, 3);
      }),
      latestPosts: this.store.findAll('forum-thread').then((posts) => {
        return posts.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);
      }),
      latestWiki: this.store.findAll('wiki-page').then((wiki) => {
        return wiki.slice(0, 3);
      }),
      latestYoutubeVideoId: this.fetchLatestYoutubeVideoId().catch(() => null),
    });
  }

  afterModel() {
    this.setHeadTags();
  }

  setHeadTags() {
    const headTags = ENV.headTags;
    this.headTags = Object.values(headTags);
  }
}
