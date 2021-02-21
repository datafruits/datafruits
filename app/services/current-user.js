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
      return this.store.queryRecord('user', { me: true }).then((user) => {
        this.set('user', user);
      });
    } else {
      return resolve();
    }
  }
}
