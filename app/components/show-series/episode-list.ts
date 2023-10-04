import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import type ShowSeries from 'datafruits13/models/show-series'
import Store from '@ember-data/store';

interface ShowSeriesEpisodeListArgs {
  showSeries: ShowSeries;
}

export default class ShowSeriesEpisodeList extends Component<ShowSeriesEpisodeListArgs> {
  @service declare store: Store;

  @action
  fetchEpisodes() {
    return this.store.query('scheduled-show', { showSeries: this.args.showSeries.slug, status: 'archive_published' });
  }
}
