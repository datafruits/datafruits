import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    willTransition: function(transition) {
      Ember.$("#showModal").modal('hide');
    }
  },

  setupController: function(controller, model){
    this._super(controller, model);
    Ember.run.schedule('afterRender', this, function () {
      Ember.$("#showModal").modal('show');
      var _this = this;
      Ember.$("#showModal").on('hidden.bs.modal', function () {
        console.log("modal exited");
        _this.transitionTo('application');
      });
    });
  },

  model: function(params) {
    return Ember.$.getJSON('http://datafruits.streampusher.com/scheduled_shows/'+params.id+'.json')
    .then(function(data){
      return data;
    });
  }
});
