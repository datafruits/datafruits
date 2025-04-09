import { service } from "@ember/service";
import Route from '@ember/routing/route';

export default class AboutRoute extends Route {
  @service store;
}
