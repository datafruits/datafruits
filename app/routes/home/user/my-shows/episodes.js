import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeUserMyShowsEpisodes extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('show-series', params.slug, {
      adapterOptions: {
        my: true
      }
    });
  }
}
