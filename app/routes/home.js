import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

@classic
export default class HomeRoute extends Route {
  @service
  intl;

  @service
  fastboot;

  afterModel() {
    if (!this.fastboot.isFastBoot) {
      let locales = this.intl.locales;
      let language;
      if (navigator.languages) {
        language = navigator.languages[0];
      } else {
        language = navigator.language || navigator.userLanguage;
      }
      language = locales.includes(language.toLowerCase()) ? language : 'en';

      this.set('intl.locale', language);
    }
  }

  refreshNext() {
    later(() => {
      this.model();
      this.refreshNext();
    }, 60000);
  }
}
