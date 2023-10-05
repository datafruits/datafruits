import Component from '@glimmer/component';
import type ShowSeries from 'datafruits13/models/show-series';

interface ShowsListArgs {
  shows: [ShowSeries];
}

export default class ShowsList extends Component<ShowsListArgs> {
  get filteredShows() {
    return this.args.shows.filter((show: ShowSeries) => {
      return show.status !== "disabled";
    });
  }
}
