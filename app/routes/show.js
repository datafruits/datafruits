import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  model: function(params) {
    return fetch('http://datafruits.streampusher.com/scheduled_shows/'+params.id+'.json')
    .then(function(data){
      return data;
    });
  }
});
