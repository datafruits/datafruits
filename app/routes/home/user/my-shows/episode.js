import Route from '@ember/routing/route';
import { service } from "@ember/service";
import AuthenticatedRouteMixin from 'datafruits13/mixins/authenticated-route';

export default class HomeUserMyShowsEpisode extends Route.extend(AuthenticatedRouteMixin) {
  @service store;

  model(params) {
    return this.store.findRecord('scheduled-show', params.slug, {
      adapterOptions: {
        show_series_id: params.show_slug,
      },
      include: 'show-series'
    });
  }
}
