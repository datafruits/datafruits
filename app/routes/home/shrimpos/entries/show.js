import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class ShrimposEntriesShow extends Route {
  @service store;

  async model(params) {
    return this.store.findRecord('shrimpo-entry', params.slug, {
      adapterOptions: {
        shrimpo_id: params.shrimpo_slug, // :shrug:
      },
    });
  }
}
