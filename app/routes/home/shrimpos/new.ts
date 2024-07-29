import Route from '@ember/routing/route';

export default class HomeShrimposNew extends Route {
  model() {
    return this.store.createRecord('shrimpo');
  }
}
