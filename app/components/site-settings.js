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
    this.intl.locale = locale;
  }

  @action
  setTheme(theme) {
    this.theme.setTheme(theme);
  }

  @action
  setWeather(event) {
    this.weather.setWeather(event.target.value);
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SiteSettingsComponent: typeof SiteSettingsComponent;
  }
}
  
