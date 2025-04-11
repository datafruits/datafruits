import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeWikiShow extends Route {
  @service store;

  model(params: any) {
    return this.store.findRecord('wikiPage', params.title);
  }
}
