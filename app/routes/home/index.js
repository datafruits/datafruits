import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';
import { hash } from 'rsvp';
import dayjs from 'dayjs';

export default class IndexRoute extends Route {
  @service fastboot;
  @service store;

  async model() {
    let query = {
      start: dayjs().format('YYYY-MM-DD HH:MM Z'),
      end: dayjs().endOf('month').add(1, 'month').format('YYYY-MM-DD'),
    };
    return hash({
      upcomingShows: this.store.query('scheduled-show', query).then((shows) => {
        return shows.slice(0, 6);
      }),
      latestPodcasts: this.store.query('podcast', {
      }).then((podcasts) => {
        return podcasts.slice(0, 6);
      })
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
