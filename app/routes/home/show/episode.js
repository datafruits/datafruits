import Route from '@ember/routing/route';

export default class HomeShowEpisode extends Route {
  model(params) {
    return this.store.findRecord('scheduled-show', params.title, {
      include: 'show-series'
    });
  }
}
