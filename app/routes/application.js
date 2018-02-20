import Route from '@ember/routing/route';
import fetch from 'fetch';

export default Route.extend({
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
