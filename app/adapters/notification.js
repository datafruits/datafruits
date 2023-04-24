import ApplicationAdapter from './application';
import classic from 'ember-classic-decorator';

@classic
export default class Notification extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/notification`;
  }
}
