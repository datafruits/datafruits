import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type { HomeUserMyShowsEpisodesRouteModel } from 'datafruits13/routes/home/user/my-shows/episodes';

export default class HomeUserMyShowsEpisodesController extends Controller{
  declare model: HomeUserMyShowsEpisodesRouteModel;

  @service declare store: any;

  @action
  fetchEpisodes() {
    return this.store.query('scheduled-show', { showSeries: this.model.slug });
  }
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'home/user/my-shows/episodes': HomeUserMyShowsEpisodesController;
  }
}
