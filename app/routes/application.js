import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

export default Route.extend({
  model(){
    return this.store.queryRecord('scheduled-show', {next: true});
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
