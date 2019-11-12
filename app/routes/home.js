import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

@classic
export default class HomeRoute extends Route {
  @service
  i18n;

  @service
  fastboot;

  model() {
    return this.store.queryRecord('scheduled-show', {next: true});
  }

  afterModel() {
    if(!this.get('fastboot.isFastBoot')){
      let locales = this.get('i18n.locales');
      let language;
      if(navigator.languages){
        language = navigator.languages[0];
      }else {
        language = navigator.language || navigator.userLanguage;
      }
      language = locales.includes(language.toLowerCase()) ? language : 'en';

      this.set('i18n.locale', language)
    }
  }

  refreshNext() {
    later(() => {
      this.model();
      this.refreshNext();
    }, 60000);
  }
}
