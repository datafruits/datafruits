import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class Weather extends Service {
  setWeather(weather: string) {
    this.currentWeather = weather;
  }

  @tracked currentWeather: string = "cloudy";
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module "@ember/service" {
  interface Registry {
    weather: Weather;
  }
}
