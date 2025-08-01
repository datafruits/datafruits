import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeUserMyShowsEpisode extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('scheduled-show', params.slug, {
      adapterOptions: {
        show_series_id: params.show_slug,
      },
      include: 'show-series'
    });
  }
}
