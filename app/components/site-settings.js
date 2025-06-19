import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SiteSettingsComponent extends Component {
  @service
  intl;

  @service
  theme;

  @service
  weather;

  @action
  setLocale(locale) {
    this.intl.setLocale(locale);
  }

  @action
  setTheme(event) {
    this.theme.setTheme(event.target.value);
  }

  @action
  setWeather(event) {
    this.weather.setWeather(event.target.value);
  }
}
