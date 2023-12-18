import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

interface WeatherSelectorArgs {}

export default class WeatherSelector extends Component<WeatherSelectorArgs> {
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
