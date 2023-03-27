import Route from '@ember/routing/route';

export default class HomeShows extends Route {
  model() {
    return this.store.findAll('show-series');
  }
}
