import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

@classic
export default class GiphyLoader extends Component {
  didReceiveAttrs() {
    let query = this.query;
    this.fetchData.perform(query);
  }

  @service
  store;

  @(task(function*(query) {
    yield timeout(1000);
    let gifs = this.store.query('gif', { query })
    let resolvedGifs = yield gifs;
    return this.set('data', resolvedGifs);
  }).restartable())
  fetchData;
}
