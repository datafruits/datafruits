import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentUserService extends Service {
  @service
  session;

  @service
  store;

  @tracked
  user;

  async load() {
    if (this.session.isAuthenticated) {
      // use existing record if its already loaded
      let user = this.store.peekRecord('user', this.session.data.authenticated.id || '');
      if (user) {
        this.user = user;
      } else {
        // otherwise we need to get it from the API
        user = await this.store.queryRecord('user', { me: true });
        this.user = user;
      }
    }
  }
}
