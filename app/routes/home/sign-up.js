import { service } from "@ember/service";
import Route from '@ember/routing/route';

export default class HomeSignUpRoute extends Route {
  @service store;
  model() {
    return this.store.createRecord('user');
  }
}
