import { service } from "@ember/service";
import Route from '@ember/routing/route';

export default class HomeSiteSettingsRoute extends Route {
  @service store;
}
