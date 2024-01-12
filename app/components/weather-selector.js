import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class WeatherSelector extends Component {
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
