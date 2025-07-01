import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeShrimpoShow extends Route {
  @service store;

  async model(params) {
    return this.store.findRecord('shrimpo', params.title, { reload: true });
  }
}
