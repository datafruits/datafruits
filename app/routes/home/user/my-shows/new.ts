import Route from '@ember/routing/route';

export default class HomeUserMyShowsNew extends Route {
  model() {
    const date = (new Date()).toISOString().split("T")[0];

    return this.store.createRecord('show-series', {
      startDate: date,
      endDate: date,
    });
  }
}
