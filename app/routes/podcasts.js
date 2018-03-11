import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model(){
    return hash({
      tracks: this.store.queryRecord('podcast', { name: 'datafruits' }).then((podcast) => {
        return podcast.get('tracks');
      }),
      labels: this.store.findAll('label')
    });
  }
});
