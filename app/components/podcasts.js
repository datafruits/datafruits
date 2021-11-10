import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import App from '../app';
import Component from '@glimmer/component';

export default class PodcastsSearch extends Component {
  @service
  store;

  @service
  router;

  get labelNames() {
    return this.args.labels.map(function (label) {
      return label.get('name');
    });
  }

  get selectedLabels() {
    const queryParams = this.router.currentRoute.queryParams;
    if (queryParams.tags) {
      return queryParams.tags.split(',');
    } else {
      return [];
    }
  }

  @action
  nop() {}

  @action
  fetchPodcasts() {
    const query = this.args.query;
    console.log(query);
    let podcastsPromise = this.store.queryRecord('podcast', query).then((podcast) => {
      return hash({
        tracks: podcast.get('tracks'),
        meta: App.storeMeta['podcast'],
      });
    });

    return podcastsPromise;
  }
}
