import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';

export default Controller.extend({
  i18n: service(),
  router: service(),
  locale: oneWay('i18n.locale'),
  menuOpen: false,
  submenuOpen: false,
  init(){
    this._super(...arguments);
    this.router.on('routeWillChange', () => {
      this.set('menuOpen', false);
      this.set('submenuOpen', false);
    });
  },
  actions: {
    setLocale(locale){
      this.set('i18n.locale', locale);
    },
    toggleMenu(){
      this.toggleProperty('menuOpen');
    },
    toggleSubMenu(){
      this.toggleProperty('submenuOpen');
    }
  }
});
