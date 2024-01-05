import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HomeUserMyShowsEpisode extends Route {
  @service declare store: any;

  model(params: any) {
    return this.store.findRecord('scheduled-show', params.slug, {
      adapterOptions: {
        show_series_id: params.show_slug,
      },
      include: 'show-series'
    });
  }
}
