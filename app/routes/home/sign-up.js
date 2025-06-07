import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeSignUpRoute extends Route {
  @service store;

  model() {
    return this.store.createRecord('user');
  }
}
