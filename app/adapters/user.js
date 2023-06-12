import ApplicationAdapter from './application';
import classic from 'ember-classic-decorator';

@classic
export default class UserAdapter extends ApplicationAdapter {
  urlForQuery(query) {
    return `${this.urlPrefix()}/api/djs`;
  }

  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${this.urlPrefix()}/users/current_user`;
    } else {
      return `${this.urlPrefix()}/djs/${query.id}`;
    }
  }

  urlForCreateRecord() {
    return `${this.urlPrefix()}/api/listeners`;
  }

  urlForUpdateRecord() {
    return `${this.urlPrefix()}/users/current_user`;
  }
}
