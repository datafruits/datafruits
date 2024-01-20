import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

import ChatService from "datafruits13/services/chat";
import ThemeService from "datafruits13/services/theme";
import Weather from "datafruits13/services/weather";

export default class WebsiteSettings extends Component {
  @service declare intl: any;
  @service declare theme: ThemeService;
  @service declare weather: Weather;
  @service declare chat: ChatService;

  @action
  toggleGifsEnabled() {
    this.chat.gifsEnabled = !this.chat.gifsEnabled;
  }
  @action
  setLocale(locale: any) {
    this.intl.locale = locale;
  }

  @action
  setTheme(theme: any) {
    this.theme.setTheme(theme);
  }

  @action
  setWeather(event: any) {
    this.weather.setWeather(event.target.value);
  }
}
