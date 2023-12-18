// @ts-ignore
import Component from "@glimmer/component";
// @ts-ignore
import { tracked } from "@glimmer/tracking";

export default class WeatherSelector extends Component {
  @tracked currentWeather: string = "snowy";

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
