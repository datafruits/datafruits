import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class WeatherSelector extends Component {
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
