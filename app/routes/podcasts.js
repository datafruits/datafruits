import Ember from 'ember';
//import fetch from 'fetch';

export default Ember.Route.extend({
  model(){
    return Ember.RSVP.hash({
      tracks: this.store.queryRecord('podcast', { name: 'datafruits' }).then((podcast) => {
        return podcast.get('tracks');
      }),
      labels: this.store.findAll('label')
    });
  }
});
