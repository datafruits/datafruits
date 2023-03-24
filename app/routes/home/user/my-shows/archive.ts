import Route from '@ember/routing/route';

export default class HomeUserMyShowsArchive extends Route {
  model(params: any) {
    return this.store.findRecord('show-series', params.id);
  }
}
