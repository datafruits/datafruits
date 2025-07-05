import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import eq from "ember-truth-helpers/helpers/equal";

export default class WeatherSelector extends Component {<template><label id="weather-selector-label" for="weather-selector">
  {{t "weather.label"}}
</label>
<select name="weather-selector" id="weather-selector" class="bg-df-pink" {{on "change" @setWeather}}>
  {{#each this.weathers as |weather|}}
    {{#if (eq weather.value this.weather.currentWeather)}}
      <option selected value={{weather.value}}>
        {{weather.text}}
      </option>
    {{else}}
      <option value={{weather.value}}>
        {{weather.text}}
      </option>
    {{/if}}
  {{/each}}
</select></template>
  @service
  weather;

  weathers = [
    {
      text: "☁",
      value: "cloudy",
    },
    {
      text: "🌨",
      value: "snowy",
    },
    {
      text: "🐈🐕",
      value: "cats-dogs",
    },
  ];
}
