//import { action } from '@ember/object';
//import { tracked } from '@glimmer/tracking';
import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
//import { hash } from 'rsvp';
import Component from '@glimmer/component';

interface PodcastsArgs {
  labels: [any];
  query: any;
  page: number;
}

export default class PodcastsSearch extends Component<PodcastsArgs> {
  @service declare store: Store;

  @service declare router: RouterService;

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

  get fetchPodcasts() {
    const query = this.args.query;
    console.log('query: ', query);
    const podcastsPromise = this.store.query('podcast', query);
    return podcastsPromise;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PodcastsSearch: typeof PodcastsSearch;
  }
}
