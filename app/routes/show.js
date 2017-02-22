import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  model(params) {
    return fetch('http://datafruits.streampusher.com/scheduled_shows/'+params.id+'.json')
    .then(function(response){
      return response.json();
    });
  }
});
