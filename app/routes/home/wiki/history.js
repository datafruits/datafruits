import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeWikiHistory extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('wikiPage', params.title);
  }
}
