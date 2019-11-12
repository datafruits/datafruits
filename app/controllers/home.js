import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import Controller from '@ember/controller';

@classic
export default class HomeController extends Controller {
  @service
  i18n;

  @service
  router;

  @oneWay('i18n.locale')
  locale;

  menuOpen = false;
  submenuOpen = false;

  init() {
    super.init(...arguments);
    this.router.on('routeWillChange', () => {
      this.set('menuOpen', false);
      this.set('submenuOpen', false);
    });
  }

  @action
  setLocale(locale) {
    this.set('i18n.locale', locale);
  }

  @action
  toggleMenu() {
    this.toggleProperty('menuOpen');
  }

  @action
  toggleSubMenu() {
    this.toggleProperty('submenuOpen');
  }
}
