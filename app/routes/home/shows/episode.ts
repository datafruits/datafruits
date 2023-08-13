import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HomeShowsEpisode extends Route {
  @service declare store: any;

  model(params: any) {
    return this.store.findRecord('scheduled-show', params.title, {
      adapterOptions: {
        show_series_id: params.show_title, // :shrug:
      },
      include: ['show-series', 'posts']
    });
  }
}
