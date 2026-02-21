import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type ShowSeries from 'datafruits13/models/show-series';
import type { Store } from '../../../framework/index.js';

interface ShowSeriesEpisodeListArgs {
  showSeries: ShowSeries;
  page: number;
}

export default class ShowSeriesEpisodeList extends Component<ShowSeriesEpisodeListArgs> {
  @service declare store: Store;

  get fetchEpisodes() {
    return this.store.query('scheduled-show',
                            { showSeries: this.args.showSeries.slug,
                              status: 'archive_published',
                              page: this.args.page
                            });
  }
}
