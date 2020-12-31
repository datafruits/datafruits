import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import { debounce } from '@ember/runloop';
import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

@classic
export default class HomeController extends Controller {
  @service
  intl;

  @service
  router;

  @service
  session;

  @service
  currentUser;

  @oneWay('intl.locale')
  locale;

  menuOpen = false;
  submenuOpen = false;
  isShowingUserMenu = false;

  @tracked
  showingPixi = true;

  init() {
    super.init(...arguments);
    this.router.on('routeWillChange', () => {
      this.set('menuOpen', false);
      this.set('submenuOpen', false);
    });
    // later(() => {
    //   this.showingPixi = false;
    // }, 15000);
  }

  @action
  setLocale(locale) {
    this.set('intl.locale', locale);
  }

  @action
  setTheme(theme) {
    let element = document.getElementsByTagName('html')[0];
    let currentTheme = `theme-${localStorage.getItem('datafruits-theme') || 'classic'}`;
    element.classList.remove(currentTheme);
    let themeName = `theme-${theme}`;
    element.classList.add(themeName);
    localStorage.setItem('datafruits-theme', theme);
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

  @action
  toggleUserMenu() {
    this.toggleProperty('isShowingUserMenu');
  }
}
