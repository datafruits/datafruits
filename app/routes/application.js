import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.store.queryRecord('scheduled-show', {next: true});
  },
  afterModel(){
    this.refreshNext();
  },
  refreshNext() {
    this.model();
    Ember.run.later(() => {
      this.refreshNext();
    }, 10000);
  },
});
