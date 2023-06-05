import Route from '@ember/routing/route';

export default class HomeUserMyShowsEpisodes extends Route {
  model(params: any) {
    return this.store.findRecord('show-series', params.title, {
      adapterOptions: {
        my: true
      }
    });
  }
}
