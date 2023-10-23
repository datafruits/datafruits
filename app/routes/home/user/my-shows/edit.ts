import Route from '@ember/routing/route';

export default class HomeUserMyShowsEdit extends Route {
  model(params: any) {
    return this.store.findRecord('show-series', params.slug, {
      adapterOptions: {
        my: true
      }
    });
  }
}
