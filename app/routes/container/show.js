import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ShowRoute extends Route {
  @service('store') store;
model(params) {
    return this.store.findRecord('scheduled-show', params.id);
  }
}
