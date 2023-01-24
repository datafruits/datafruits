import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class ScheduledShow extends ApplicationAdapter {
  namespace = 'api';

  urlForQuery(query) {
    if (query.my) {
      return `${this.urlPrefix()}/my_shows`;
    } else {
      return `${this.urlPrefix()}/scheduled_shows`;
    }
  }

  urlForQueryRecord(query) {
    if (query.next) {
      return `${this.urlPrefix()}/scheduled_shows/next`;
    }
  }
}
