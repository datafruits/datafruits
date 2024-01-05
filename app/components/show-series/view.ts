import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
//import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { SafeString } from 'handlebars';
import emojione from 'emojione';
import type ShowSeries from 'datafruits13/models/show-series'
import type RouterService from '@ember/routing/router-service';

interface ShowSeriesViewArgs {
  showSeries: ShowSeries;
}

export default class ShowSeriesView extends Component<ShowSeriesViewArgs> {
  @service declare session: any;
  @service declare currentUser: any;
  @service declare router: RouterService;

  // @action
  // browseLabel(label) {
  //   this.router.transitionTo('home.podcasts', { queryParams: { tags: label.name } });
  // }

  get description(): SafeString | undefined {
    if(this.args.showSeries.description) {
      return htmlSafe(emojione.shortnameToImage(this.args.showSeries.description));
    } else {
      return undefined;
    }
  }
}
