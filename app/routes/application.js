import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Route.extend({
  i18n: service(),
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
    }, 60000);
  },
  actions: {
    setLocale(locale){
      this.set('i18n.locale', locale);
    }
  }
});
