import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ThemeSelector from "./theme-selector.js";
import LocaleSelector from "./locale-selector.js";
import WeatherSelector from "./weather-selector.js";

export default class SiteSettingsComponent extends Component {<template><div class="flex flex-wrap justify-evenly my-4 mt-1 text-white">
  <ThemeSelector @setTheme={{this.setTheme}} />
  <LocaleSelector @selectedLocale={{this.intl.locale.value}} @setLocale={{this.setLocale}} />
  <WeatherSelector @setWeather={{this.setWeather}} />
</div></template>
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
