import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return Ember.$.getJSON('http://datafruits.streampusher.com/scheduled_shows/next.json')
    .then(function(data){
      return data;
    });
  }
});
