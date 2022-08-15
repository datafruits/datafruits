import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class ScheduledShow extends ApplicationAdapter {
  namespace = 'api';

  urlForQuery(query) {
    return `${this.urlPrefix()}/scheduled_shows`;
  }

  urlForQueryRecord(query) {
    if (query.next) {
      return `${this.urlPrefix()}/scheduled_shows/next`;
    }
  }
}
