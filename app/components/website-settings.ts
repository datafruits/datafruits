import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

import type ChatService from "datafruits13/services/chat";
import type ThemeService from "datafruits13/services/theme";
import type Weather from "datafruits13/services/weather";
import type EventBusService from "datafruits13/services/event-bus";
import type VideoStreamService from "datafruits13/services/video-stream";

export default class WebsiteSettings extends Component {
  @service declare intl: any;
  @service declare theme: ThemeService;
  @service declare weather: Weather;
  @service declare chat: ChatService;
  @service declare videoStream: VideoStreamService;
  @service declare eventBus: EventBusService;
  @service declare fastboot: any;

  @action
  toggleGifsEnabled() {
    this.chat.gifsEnabled = !this.chat.gifsEnabled;
  }

  @action
  toggleVideo() {
    this.videoStream.toggleDisplay();
  }

  @action
  setLocale(event: Event) {
    if (event.target) {
      const target = event.target as HTMLOptionElement;
      this.intl.setLocale(target.value);
      // Save locale preference to localStorage for persistence
      if (!this.fastboot.isFastBoot) {
        localStorage.setItem('datafruits-locale', target.value);
      }
    }
  }

  @action
  setTheme(event: any) {
    this.theme.setTheme(event.target.value);
  }

  @action
  setWeather(event: Event) {
    if (event.target) {
      const target = event.target as HTMLOptionElement;
      this.weather.setWeather(target.value);
      this.eventBus.publish("weatherChanged", target.value);
    }
  }
}
