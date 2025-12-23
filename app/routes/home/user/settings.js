import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'datafruits13/mixins/authenticated-route';

export default class UserSettingsRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service session;
  @service redirectAfterLogin;
}
