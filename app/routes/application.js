import Ember from 'ember';
import fetch from 'ember-network/fetch';

export default Ember.Route.extend({
  model: function(){
    return fetch('http://datafruits.streampusher.com/scheduled_shows/next.json')
    .then(function(data){
      return data;
    });
  }
});
