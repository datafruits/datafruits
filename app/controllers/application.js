import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';

export default Controller.extend({
  i18n: service(),
  collapsed: false,
  locale: oneWay('i18n.locale'),
  actions: {
    setLocale(locale){
      this.set('i18n.locale', locale);
    }
  }
});
