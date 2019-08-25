import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  didReceiveAttrs() {
    let query = this.query;
    this.fetchData.perform(query);
  },

  store: service(),
  fetchData: task(function*(query) {
    console.log(`query in gif`);
    yield timeout(1000);
    let gifs = this.store.query('gif', { query })
    let resolvedGifs = yield gifs;
    return this.set('data', resolvedGifs);
  }).restartable(),
});
