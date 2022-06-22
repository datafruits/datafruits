import Route from '@ember/routing/route';

export default class PodcastsShowRoute extends Route {
  async model(params) {
    return this.store.loadRecord('track', params.id);
  }
}
