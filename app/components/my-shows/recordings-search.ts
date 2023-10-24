import Component from '@glimmer/component';
import { action } from '@ember/object';
import Store from '@ember-data/store';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';

interface MyShowsRecordingsSearchArgs {
  changeset: BufferedChangeset;
}

export default class MyShowsRecordingsSearch extends Component<MyShowsRecordingsSearchArgs> {
  @service declare store: Store;
  @tracked recordings: any;

  @action
  didInsert() {
    this.recordings = this.store.findAll('recording');
  }

  @action
  selectRecording(recording: any) {
    this.args.changeset.set('recording', recording);
  }

  @action
  searchRecordings(term: string) {
    return new Promise((resolve, reject) => {
      debounce(this, this._performSearch, term, resolve, reject, 600);
    });
  }

  _performSearch(term: string, resolve: any, reject: any) {
    this.store.query('recording', { term: term }).then((recordings: any) => {
      this.recordings = recordings;
      // if show has prerecorded file, add a fake option to use the prerecorded file???
      return resolve(recordings);
    }, reject);
  }
}
