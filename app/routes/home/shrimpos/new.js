import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeShrimposNew extends Route {
  @service store;

  model() {
    let newShrimpo = this.store.createRecord('shrimpo');
    newShrimpo.shrimpoType = 'normal';
    return newShrimpo;
  }
}
