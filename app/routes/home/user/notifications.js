import Route from '@ember/routing/route';
import { service } from "@ember/service";
import AuthenticatedRouteMixin from 'datafruits13/mixins/authenticated-route';

export default class HomeUserNotifications extends Route.extend(AuthenticatedRouteMixin) {
  @service store;

  model() {
    return this.store.findAll('notification');
  }
}
