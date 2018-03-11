import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    showEvent: function(show){
      this.transitionTo('show', show);
    }
  }

});
