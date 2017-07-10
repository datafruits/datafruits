import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  model(){
    return Ember.RSVP.hash({
      podcasts: fetch('https://datafruits.streampusher.com/podcasts/datafruits.json')
        .then(function(response){
          return response.json().then(function(json){
            return json.podcast.tracks;
          });
        }),
      labels: fetch('https://datafruits.streampusher.com/labels.json')
        .then(function(response){
          return response.json().then(function(json){
            return json.labels;
          });
        })
    });
  }
});
