import Route from '@ember/routing/route';

export default class HomeUserMyShowsNew extends Route {
  model() {
    const date = (new Date()).toISOString().split("T")[0];
    const time = new Date();

    return this.store.createRecord('show-series', {
      startDate: date,
      endDate: date,
      startTime: time,
      endTime: time,
      recurringInterval: 'not_recurring'
    });
  }
}
