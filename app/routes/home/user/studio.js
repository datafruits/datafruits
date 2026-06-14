import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';

export default class HomeUserStudio extends Route {
  @tracked showAdvanced = false;
}
