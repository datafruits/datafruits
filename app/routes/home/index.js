import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'datafruits13/config/environment';
import { hash } from 'rsvp';
import moment from 'moment';

export default Route.extend({
  fastboot: service(),
  model: async function(){
    let query = {
      start: moment().format('YYYY-MM-DD'),
      end: moment().endOf('month').add(1, 'month').format('YYYY-MM-DD')
    };
    const podcast = await this.store.queryRecord('podcast', {
      name: 'datafruits',
      page: 1,
    });
    return hash({
      upcomingShows: this.store.query('scheduled-show', query).then((shows) => {
        return shows.slice(0,6);
      }),
      latestPodcasts: podcast.get('tracks').then((tracks) => {
        return tracks.slice(0,6);
      }),
      blogPosts: this.store.findAll('blogPost')
    });
  },

  afterModel() {
   this.setHeadTags();
  },

  setHeadTags() {
    const headTags = ENV.headTags;
    this.set('headTags', Object.values(headTags));
  },
});
