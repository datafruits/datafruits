import { service } from "@ember/service";
import Route from '@ember/routing/route';

export default class HomeShows extends Route {
  @service store;
  model() {
    return this.store.findAll('show-series');
  }
}
