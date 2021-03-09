import Route from '@ember/routing/route';

export default class HomeSignUpRoute extends Route {
  model() {
    return this.store.createRecord('user');
  }
}
