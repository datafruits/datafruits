import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

import type ChatService from "datafruits13/services/chat";
import type ThemeService from "datafruits13/services/theme";
import type Weather from "datafruits13/services/weather";

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
  setLocale(event: Event) {
    if (event.target) {
      const target = event.target as HTMLOptionElement;
      this.intl.locale = target.value;
    }
  }

  @action
  setTheme(theme: any) {
    this.theme.setTheme(theme);
  }

  @action
  setWeather(event: Event) {
    debugger;
    if (event.target) {
      const target = event.target as HTMLOptionElement;
      this.weather.setWeather(target.value);
    }
  }
}
