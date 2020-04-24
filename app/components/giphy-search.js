import classic from 'ember-classic-decorator';
import { observes } from '@ember-decorators/object';
import Component from '@ember/component';
import '@ember/object'; //eslint-disable-line ember/no-observers
import { debounce } from '@ember/runloop';

@classic
export default class GiphySearch extends Component {
  @observes('searchTerm')
  observeQuery() { //eslint-disable-line ember/no-observers
    debounce(this, this.setQuery, 500);
  }

  setQuery() {
    this.set('query', this.searchTerm)
  }
}
