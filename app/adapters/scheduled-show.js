import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class ScheduledShow extends ApplicationAdapter {
  namespace = 'api';

  urlForQuery(query) {
    return `${this.urlPrefix()}/show_series/${query.showSeries}/episodes`;
  }

  urlForQueryRecord(query) {
    if (query.next) {
      return `${this.urlPrefix()}/scheduled_shows/next`;
    }
  }

  urlForUpdateRecord(id, modelName, snapshot) {
    debugger
    return `${this.urlPrefix}/my_shows/${snapshot.belongsTo('showSeries').attr('slug')}/episodes/${snapshot.attr('slug')}`;
  }
}
