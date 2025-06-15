import Route from '@ember/routing/route';

export default class ShowRoute extends Route {
  model(params) {
    return this.store.findRecord('scheduled-show', params.id);
  }
}
