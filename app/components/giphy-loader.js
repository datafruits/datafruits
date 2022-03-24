import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class GiphyLoader extends Component {
  @tracked data;

  @action
  fetchGifs() {
    this.fetchData.perform(this.args.query);
  }

  @service
  store;

  @(task(function* (query) {
    yield timeout(1000);
    // need to debounce here ???
    let gifs = this.store.query('gif', { query });
    let resolvedGifs = yield gifs;
    this.data = resolvedGifs;
  }).restartable())
  fetchData;
}
