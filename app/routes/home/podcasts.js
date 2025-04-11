import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default class PodcastsRoute extends Route {
  async model(params) {
    return hash({
      labels: this.store.findAll('label'),
    });
  }
}
