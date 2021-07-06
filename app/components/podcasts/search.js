import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default class PodcastsSearchComponent extends Component {
  @service router;

  @action
  clearSearch() {
    const query = { query: '', tags: this.selectedLabels };
    this.router.transitionTo({ queryParams: query });
    debounce(this, this.args.search, 400);
  }

  @action
  updateQueryAndSearch(event) {
    console.log(event.target.value);
    const query = { query: event.target.value, tags: this.selectedLabels };
    this.router.transitionTo({ queryParams: query });
    debounce(this, this.args.search, 400);
  }

  @action
  nop() {}

  get labelNames() {
    return this.args.labels.map(function (label) {
      return label.get('name');
    });
  }

  // get selectedLabels() {
  //   const queryParams = this.router.currentRoute.queryParams;
  //   if(queryParams.tags) {
  //     return queryParams.tags.split(',');
  //   }
  // }
}
