import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

@classic
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
    console.log('in home beforeModel');
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
    console.log('in sessionAuthenticated');
    let _super = this._super;
    await this._loadCurrentUser();
    await this._loadCurrentRadio();
    _super.call(this, ...arguments);
  }

  _loadCurrentUser() {
    console.log('_loadCurrentUser');
    return this.currentUser.load().catch(() => this.session.invalidate());
  }
}
