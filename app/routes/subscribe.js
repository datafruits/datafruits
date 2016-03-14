import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    willTransition: function(transition) {
      Ember.$("#subscribeModal").modal('hide');
    }
  },

  setupController: function(controller, model){
    this._super(controller, model);
    Ember.run.schedule('afterRender', this, function () {
      Ember.$("#subscribeModal").modal('show');
      var _this = this;
      Ember.$("#subscribeModal").on('hidden.bs.modal', function () {
        console.log("modal exited");
        _this.transitionTo('application');
      });
    });
  }

});
