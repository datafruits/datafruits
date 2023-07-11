import Route from '@ember/routing/route';

export default class HomeUserNotifications extends Route {
  model() {
    return this.store.findAll('notification');
  }
}
