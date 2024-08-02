import { service } from "@ember/service";
import Route from '@ember/routing/route';

export default class CatRoute extends Route {
  @service store;
}
