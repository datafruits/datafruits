import Route from '@ember/routing/route';
import { service } from "@ember/service";
import dayjs from 'dayjs';
import AuthenticatedRouteMixin from 'datafruits13/mixins/authenticated-route';

export default class HomeUserMyShowsNew extends Route.extend(AuthenticatedRouteMixin) {
  @service('store') store;

  @service currentUser;

  model() {
    const date = (new Date()).toISOString().split("T")[0];
    const time = dayjs();

    const newShow = this.store.createRecord('show-series', {
      startDate: date,
      startTime: time,
      endTime: time.add(2, 'hour'),
      recurringInterval: 'not_recurring'
    });
    newShow.users.push(this.currentUser.user);
    return newShow;
  }
}
