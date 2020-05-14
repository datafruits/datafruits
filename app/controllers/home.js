import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import { debounce } from '@ember/runloop';
import Controller from '@ember/controller';

@classic
export default class HomeController extends Controller {
  @service
  intl;

  @service
  router;

  @oneWay('intl.locale')
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
    this.set('intl.locale', locale);
  }

  @action
  toggleMenu() {
    this.toggleProperty('menuOpen');
  }

  @action
  toggleSubMenu() {
    debounce(this, 'toggleSubMenuOnce', 500, true);
  }

  toggleSubMenuOnce() {
      this.toggleProperty('submenuOpen');
  }
}
