import Route from '@ember/routing/route';
import type Shrimpo from 'datafruits13/models/shrimpo';
import { service } from '@ember/service';
import type StoreService from '@ember-data/store';

export default class HomeShrimpoShow extends Route {
  @service declare store: StoreService;

  async model(params: any): Promise<Shrimpo> {
    return this.store.findRecord('shrimpo', params.title);
  }
}
