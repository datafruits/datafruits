import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class HomeShows extends Route {
  @service store;

  model() {
    return this.store.findAll('show-series');
  }
}
