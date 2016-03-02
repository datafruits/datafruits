import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    willTransition: function(transition) {
      Ember.$("#djInquiryModal").modal('hide');
    }
  },

  setupController: function(controller, model){
    this._super(controller, model);
    Ember.run.schedule('afterRender', this, function () {
      Ember.$("#djInquiryModal").modal('show');
      var _this = this;
      Ember.$("#djInquiryModal").on('hidden.bs.modal', function () {
        _this.transitionTo('application');
      });
    });
  }
});
