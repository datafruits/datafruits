import Service, { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service
  session;

  @service
  store;

  async load() {
    if (this.session.isAuthenticated) {
      // use existing record if its already loaded
      let user = this.store.peekRecord('user', this.session.data.authenticated.user_id || '');
      if (user) {
        this.set('user', user);
      } else {
        // otherwise we need to get it from the API
        user = await this.store.queryRecord('user', { me: true });
        this.set('user', user);
      }
    }
  }
}
