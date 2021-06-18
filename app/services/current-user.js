import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';

export default class CurrentUserService extends Service {
  @service
  session;

  @service
  store;

  load() {
    if (this.session.isAuthenticated) {
      // use existing record if its already loaded
      let user = this.store.peekRecord('user', this.session.data.authenticated.user_id || '');
      if (user) {
        this.set('user', user);
        return resolve();
      } else {
        // otherwise we need to get it from the API
        return this.store.queryRecord('user', { me: true }).then((user) => {
          this.set('user', user);
        });
      }
    } else {
      return resolve();
    }
  }
}
