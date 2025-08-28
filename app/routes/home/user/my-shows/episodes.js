import Route from '@ember/routing/route';
import { service } from "@ember/service";
import AuthenticatedRouteMixin from 'datafruits13/mixins/authenticated-route';

export default class HomeUserMyShowsEpisodes extends Route.extend(AuthenticatedRouteMixin) {
  @service store;

  model(params) {
    return this.store.findRecord('show-series', params.slug, {
      adapterOptions: {
        my: true
      }
    });
  }
}
