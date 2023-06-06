import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HomeShowsEpisode extends Route {
  @service declare store: any;

  model(params: any) {
    return this.store.findRecord('scheduled-show', params.title, {
      include: 'show-series'
    });
  }
}
