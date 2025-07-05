import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import type ChatService from "datafruits13/services/chat";
import type ThemeService from "datafruits13/services/theme";
import type Weather from "datafruits13/services/weather";
import type EventBusService from "datafruits13/services/event-bus";
import type VideoStreamService from "datafruits13/services/video-stream";
import Modal from "./ui/modal.ts";
import TvModeButton from "./chat/tv-mode-button.js";
import ThemeSelector from "./theme-selector.js";
import LocaleSelector from "./locale-selector.js";
import WeatherSelector from "./weather-selector.js";

export default class WebsiteSettings extends Component {<template><Modal @toggleModal={{@closeDialog}}>
  <div class="modal-body m-1 text-white">
    <div class="grid grid-cols-1">
      {{#if this.videoStream.active}}
        <TvModeButton @toggleVideo={{this.toggleVideo}} @enabled={{this.videoStream.displaying}} />
      {{/if}}
      <ThemeSelector @setTheme={{this.setTheme}} />
      <LocaleSelector @selectedLocale={{this.intl.locale.value}} @setLocale={{this.setLocale}} />
      <WeatherSelector @setWeather={{this.setWeather}} />
    </div>
  </div>
</Modal></template>
  @service declare intl: any;
  @service declare theme: ThemeService;
  @service declare weather: Weather;
  @service declare chat: ChatService;
  @service declare videoStream: VideoStreamService;
  @service declare eventBus: EventBusService;

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
