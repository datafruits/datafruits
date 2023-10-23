import Route from '@ember/routing/route';
// https://docs.ember-cli-typescript.com/ember/routes
type Resolved<P> = P extends Promise<infer T> ? T : P;
export type HomeUserMyShowsEpisodesRouteModel = Resolved<ReturnType<HomeUserMyShowsEpisodes['model']>>;

export default class HomeUserMyShowsEpisodes extends Route {
  model(params: any) {
    return this.store.findRecord('show-series', params.slug, {
      adapterOptions: {
        my: true
      }
    });
  }
}
