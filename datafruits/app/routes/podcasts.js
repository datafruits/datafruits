import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    willTransition: function(transition) {
      Ember.$("#podcastsModal").modal('hide');
    }
  },

  setupController: function(controller, model){
    this._super(controller, model);
    Ember.run.schedule('afterRender', this, function () {
      Ember.$("#podcastsModal").modal('show');
      var _this = this;
      Ember.$("#podcastsModal").on('hidden.bs.modal', function () {
        console.log("modal exited");
        _this.transitionTo('application');
      });
    });
  },

  model: function(){
    return Ember.$.getJSON('http://datafruits.streampusher.com/podcasts/datafruits.json')
    .then(function(data){
      return data.podcast;
    });
  }
});
