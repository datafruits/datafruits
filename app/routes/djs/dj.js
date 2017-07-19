import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return fetch('https://datafruits.streampusher.com/djs/'+params.id+'.json')
    .then(function(response){
      return response.json();
    });
  }
});
