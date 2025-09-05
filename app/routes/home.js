import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class HomeRoute extends Route {
  @service
  currentUser;

  @service
  session;

  @service
  intl;

  @service
  fastboot;

  async beforeModel() {
    await this.session.setup();

    if (!this.fastboot.isFastBoot) {
      let element = document.getElementsByTagName('html')[0];
      let theme = localStorage.getItem('datafruits-theme') || 'classic';
      let themeName = `theme-${theme}`;
      element.classList.add(themeName);
    }
    return this._loadCurrentUser();
  }

  afterModel() {
    if (!this.fastboot.isFastBoot) {
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

  async sessionAuthenticated() {
    await this._loadCurrentUser();
    await this._loadCurrentRadio();
    super.call(this, ...arguments);
  }

  async _loadCurrentUser() {
    try {
      await this.currentUser.load();
    } catch (err) {
      console.log(err);  
      await this.session.invalidate();
    }
  }
}
