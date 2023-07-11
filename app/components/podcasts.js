import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
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
  fetchPodcasts() {
    const query = this.args.query;
    let podcastsPromise = this.store.queryRecord('podcast', query).then((podcast) => {
      return hash({
        tracks: podcast.get('tracks'),
        meta: podcast.meta,
      });
    });

    return podcastsPromise;
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PodcastsSearch: typeof PodcastsSearch;
  }
}
  
