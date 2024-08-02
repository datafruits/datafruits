import { service } from "@ember/service";
import Route from '@ember/routing/route';

export default class HomePasswordResetRoute extends Route {
  @service store;
}
