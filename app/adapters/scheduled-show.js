import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';
import { inject as service } from '@ember/service';

@classic
export default class ScheduledShow extends ApplicationAdapter {
  @service router;
  namespace = 'api';

  urlForFindRecord(id, modelName, snapshot) {
    // TODO is this nested route pointless??
    return `${this.urlPrefix()}/show_series/${snapshot.adapterOptions.show_series_id}/episodes/${id}`;
  }

  urlForQuery(query) {
    let djId = query.dj;
    let page = query.page || 1;
    if(query.start) {
      return `${this.urlPrefix()}/scheduled_shows`;
    } else if(djId) {
      return `${this.urlPrefix()}/djs/${djId}/episodes?page=${page}`;
    } else {
      return `${this.urlPrefix()}/show_series/${query.showSeries}/episodes`;
    }
  }

  urlForQueryRecord(query) {
    if (query.next) {
      return `${this.urlPrefix()}/scheduled_shows/next`;
    }
  }

  urlForUpdateRecord(id, modelName, snapshot) {
    // this looks ugly but is only done because for some reason I can't get the belongsTo('showSeries').get('slug') to work
    // the showSeries isn't loaded when the page is refreshed
    const showSeriesSlug = this.router.currentURL.split("/user/my-shows/")[1].split("/episode/")[0];
    return `${this.urlPrefix()}/my_shows/${showSeriesSlug}/episodes/${snapshot.attr('slug')}`;
  }
}
