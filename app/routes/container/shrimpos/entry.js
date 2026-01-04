import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class ContainerShrimposEntry extends Route {
  @service store;
  @service
  intl;

  async model(params) {
    return this.store.findRecord('shrimpo-entry', params.slug, {
      adapterOptions: {
        shrimpo_id: params.shrimpo_slug, // :shrug:
      },
    });
  }

  afterModel() {
    let locales = this.intl.locales;
    let language;

    // First check if user has a saved locale preference
    let savedLocale = localStorage.getItem('datafruits-locale');
    if (savedLocale && locales.includes(savedLocale.toLowerCase())) {
      language = savedLocale;
    } else {
      // Fall back to browser language detection
      console.log(navigator.languages);
      if (navigator.languages) {
        language = navigator.languages[0];
      } else {
        language = navigator.language || navigator.userLanguage;
      }
      language = locales.includes(language.toLowerCase()) ? language : 'en';
    }

    //this.intl.locale = language;
    this.intl.setLocale(language);
  }
}
