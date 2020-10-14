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

  beforeModel() {
    return this._loadCurrentUser();
  }

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

  async sessionAuthenticated() {
    await this._loadCurrentUser();
    await this._loadCurrentRadio();
    super.call(this, ...arguments);
  }

  _loadCurrentUser() {
    return this.currentUser.load().catch(() => this.session.invalidate());
  }
}
