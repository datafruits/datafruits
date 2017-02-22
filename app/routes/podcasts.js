import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  model(){
    return fetch('https://datafruits.streampusher.com/podcasts/datafruits.json')
    .then(function(response){
      return response.json().then(function(json){
        return json.podcast;
      });
    });
  }
});
