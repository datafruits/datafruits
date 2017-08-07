import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model(){
    return fetch('https://datafruits.streampusher.com/scheduled_shows/next.json')
    .then(function(response){
      return response.json();
    });
  }
});
