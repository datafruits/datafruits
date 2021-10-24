import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default class PodcastsRoute extends Route {
  async model(params) {
    console.log(params);
    return hash({
      labels: this.store.loadRecords('label'),
    });
  }
}
