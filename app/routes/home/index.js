import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';
import { hash } from 'rsvp';
import dayjs from 'dayjs';

@classic
export default class IndexRoute extends Route {
  @service
  fastboot;

  async model() {
    let query = {
      start: dayjs().format('YYYY-MM-DD'),
      end: dayjs().endOf('month').add(1, 'month').format('YYYY-MM-DD'),
    };
    const podcast = await this.store
      .loadRecords('podcast', {
        name: 'datafruits',
        page: 1,
      })
      .then((podcasts) => {
        return podcasts.get('firstObject');
      });
    return hash({
      upcomingShows: this.store.loadRecords('scheduled-show', query).then((shows) => {
        return shows.slice(0, 6);
      }),
      latestPodcasts: podcast.get('tracks').then((tracks) => {
        return tracks.slice(0, 6);
      }),
    });
  }

  afterModel() {
    this.setHeadTags();
  }

  setHeadTags() {
    const headTags = ENV.headTags;
    this.set('headTags', Object.values(headTags));
  }
}
