import Route from '@ember/routing/route';

export default class HomeShowEpisode extends Route {
  model(params) {
    return this.store.findAll('scheduled-show', params.title);
  }
}
