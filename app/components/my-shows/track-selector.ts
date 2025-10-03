import Component from '@glimmer/component';
import { action } from '@ember/object';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';
import { BufferedChangeset } from 'ember-changeset/types';
import { inject as service } from '@ember/service';

interface MyShowsTrackSelectorArgs {
  changeset: BufferedChangeset;
}

export default class MyShowsTrackSelector extends Component<MyShowsTrackSelectorArgs> {
  @service declare store: Store;

  @tracked tracks: any;

  @action didInsert() {
    this.tracks = this.store.query('track', { my: true });
  }

  @action searchTracks(term: string) {
    return new Promise((resolve, reject) => {
      debounce(this, this._performSearch.bind(this), term, resolve, reject, 600);
    });
  }

  @action selectTrack(track: any) {
    this.args.changeset.set('prerecordTrackId', track.id);
    this.args.changeset.set('prerecordTrackFilename', track.audioFileName);
    this.args.changeset.get('tracks').pop();
    this.args.changeset.get('tracks').push(track);
  }

  _performSearch(term: string, resolve: any, reject: any) {
    this.store.query('track', { term: term, my: true }).then((tracks: any) => {
      this.tracks = tracks;
      return resolve(tracks);
    }, reject);
  }
}
