import Route from '@ember/routing/route';

export default class HomeShrimpos extends Route {
  model() {
    return this.store.findAll('shrimpo');
  }
}
