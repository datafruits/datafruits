import Route from '@ember/routing/route';

export default class HomeShrimpoShow extends Route {
  model(params: any) {
    return this.store.findRecord('shrimpo', params.title);
  }
}
