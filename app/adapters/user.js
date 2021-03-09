import ApplicationAdapter from './application';

export default class UserAdapter extends ApplicationAdapter {
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
}
