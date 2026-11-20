import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class GiphyLoader extends Component {
  @tracked data;
  @tracked hasError = false;

  @action
  fetchGifs() {
    this.fetchData.perform(this.args.query);
  }

  @service
  store;

  @(task(function* (query) {
    this.data = [];
    this.hasError = false;
    if (!query?.trim()) {
      return;
    }
    yield timeout(1000);
    try {
      let gifs;
      if(this.args.gifType === "stickers" && this.args.provider !== "gifcities") {
        gifs = this.store.query('sticker', { query });
      } else {
        gifs = this.store.query('gif', { query, provider: this.args.provider });
      }
      this.data = yield gifs;
    } catch {
      this.hasError = true;
    }
  }).restartable())
  fetchData;
}
