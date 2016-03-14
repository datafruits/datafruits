import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    willTransition: function(transition) {
      Ember.$("#timetableModal").modal('hide');
    },
    showEvent: function(show){
      this.transitionTo('show', show);
    }
  },

  setupController: function(controller, model){
    this._super(controller, model);
    Ember.run.schedule('afterRender', this, function () {
      Ember.$("#timetableModal").modal('show');
      $("#calendar").fullCalendar('render');
    });
  }
});
