import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    showEvent: function(show){
      this.transitionTo('show', show);
    }
  }

});
