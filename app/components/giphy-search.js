import Component from '@glimmer/component';
//import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class GiphySearch extends Component {
  @tracked searchTerm;

  @service
  store;

  @action
  loadGifs(){
    //should debounce ???
    return this.store.query('gif', { query: this.searchTerm });
  }
}
