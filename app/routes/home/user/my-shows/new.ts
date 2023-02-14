import Route from '@ember/routing/route';

export default class HomeUserMyShowsNew extends Route {
  model() {
    return this.store.createRecord('show-series');
  }
}
