import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class ScheduledShow extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/my_shows`;
  }
}
