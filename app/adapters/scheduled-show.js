import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class ScheduledShow extends ApplicationAdapter {
  urlForQueryRecord(query) {
    if (query.next) {
      return `${this.urlPrefix()}/scheduled_shows/next`;
    }
  }

  urlForFindRecord(id, _modelName, _snapshot) {
    return `${this.urlPrefix()}/api/scheduled_shows/${id}`;
  }
}
