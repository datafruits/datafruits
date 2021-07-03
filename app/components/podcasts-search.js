import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import App from '../app';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { isArray } from '@ember/array';

export default class PodcastsSearch extends Component {
  @service
  store;

  @service
  router;

  @tracked selectedLabels = [];
  @tracked filterText = '';

  constructor(owner, args) {
    super(owner, args);

    const queryParams = this.router.currentRoute.queryParams;
    console.log(`queryParams from router service: `);
    console.log(queryParams);
    const selectedTags = this.args.selectedTags;
    if (!isEmpty(selectedTags)) {
      if (isArray(selectedTags)) {
        this.selectedLabels = selectedTags;
      } else {
        this.selectedLabels = selectedTags.split(',');
      }
    }
    const searchParams = this.args.searchParams;
    if (searchParams.query) {
      this.filterText = searchParams.query;
    }
  }

  get labelNames() {
    return this.args.labels.map(function (label) {
      return label.get('name');
    });
  }

  // @observes('filterText')
  // observeQuery() {
  //   debounce(this, this.search, 500);
  // }
  //
  // @observes('selectedLabels.[]')
  // observeLabels() {
  //   debounce(this, this.search, 100);
  // }
  //

  @action
  search() {
    //const query = { text: this.filterText, labels: this.selectedLabels };
    debounce(this, this._search, 500);
  }

  _search() {
    const queryParams = { text: this.filterText, labels: this.selectedLabels };
    console.log(queryParams);
    this.router.transitionTo({
      queryParams: {
        query: this.filterText,
        tags: this.selectedLabels,
      },
    });
    console.log('hey');
  }

  @action
  clearSearch() {
    this.filterText = '';
  }

  @action
  selectLabel(label) {
    this.selectedLabels.pushObject(label.get('name'));
  }

  @action
  nop() {}

  @action
  fetchPodcasts() {
    let query = this.args.searchParams;
    let podcastsPromise = this.store.queryRecord('podcast', query).then((podcast) => {
      return hash({
        tracks: podcast.get('tracks'),
        meta: App.storeMeta['podcast'],
        labels: this.store.findAll('label'),
      });
    });

    return podcastsPromise;
  }
}
