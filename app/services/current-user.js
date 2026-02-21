import { BaseService, service, tracked } from '../../framework/index.js';

export default class CurrentUserService extends BaseService {
  @service('session')
  session;

  @service('store')
  store;

  @tracked
  user;

  async load(forceReload = false) {
    if (this.session.isAuthenticated) {
      // use existing record if its already loaded
      let user = this.store.peekRecord('user', this.session.data.authenticated.id || '');
      if (user && !forceReload) {
        this.user = user;
      } else {
        // otherwise we need to get it from the API
        user = await this.store.queryRecord('user', { me: true });
        this.user = user;
      }
    }
  }
}
