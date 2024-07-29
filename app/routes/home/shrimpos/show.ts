import Route from '@ember/routing/route';
import type Shrimpo from 'datafruits13/models/shrimpo';

export default class HomeShrimpoShow extends Route {
  async model(params: any): Promise<Shrimpo> {
    return this.store.findRecord('shrimpo', params.title);
  }
}
