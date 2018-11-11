import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'datafruits13/config/environment';

export default Route.extend({
  i18n: service(),
  fastboot: service(),
  model(){
    return this.store.queryRecord('scheduled-show', {next: true});
  },
  afterModel(){
    if(!this.get('fastboot.isFastBoot')){
      let locales = this.get('i18n.locales');
      let language = navigator.languages[0] || navigator.language || navigator.userLanguage;
      language = locales.includes(language.toLowerCase()) ? language : 'en';

      this.set('i18n.locale', language)
    }
  },

  refreshNext() {
    later(() => {
      this.model();
      this.refreshNext();
    }, 60000);
  },
});
