import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HomeUserMyShowsNew extends Route {
  @service declare currentUser: any;

  model() {
    const date = (new Date()).toISOString().split("T")[0];
    const time = new Date();

    const newShow = this.store.createRecord('show-series', {
      startDate: date,
      endDate: date,
      startTime: time,
      endTime: time,
      recurringInterval: 'not_recurring'
    });
    newShow.users.pushObject(this.currentUser.user);
    return newShow;
  }
}
