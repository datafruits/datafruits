import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SiteSettingsComponent extends Component {
  @service
  intl;

  @service
  theme;

  @action
  setLocale(locale) {
    this.intl.locale = locale;
  }

  @action
  setTheme(theme) {
    this.theme.setTheme(theme);
  }
}
