import { BaseService, tracked } from '../../framework/index.js';

export default class Weather extends BaseService {
  setWeather(weather: string) {
    this.currentWeather = weather;
  }

  @tracked currentWeather: string = 'cloudy';
}
