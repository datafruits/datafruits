import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { service } from '@ember/service';

export default class PodcastsRoute extends Route {
  @service store;

  async model(params) {
    return hash({
      labels: this.store.findAll('label'),
    });
  }
}
