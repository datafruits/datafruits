import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class WeatherSelector extends Component {
  @tracked currentWeather = "snowy";

  weathers = [
    {
      text: "☁",
      value: "cloudy",
    },
    {
      text: "🌨",
      value: "snowy",
    },
  ];
}
