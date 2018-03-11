import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

export default Route.extend({
  model(){
    return this.store.queryRecord('scheduled-show', {next: true});
  },
  afterModel(){
    this.refreshNext();
  },
  refreshNext() {
    later(() => {
      this.model();
      this.refreshNext();
    }, 10000);
  },
});
