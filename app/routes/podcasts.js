import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return Ember.$.getJSON('http://datafruits.streampusher.com/podcasts/datafruits.json')
    .then(function(data){
      return data.podcast;
    });
  }
});
