import ApplicationAdapter from './application';

export default class UserAdapter extends ApplicationAdapter {
  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${this.urlPrefix()}/users/current_user`;
    }

    return super.urlForQueryRecord(...arguments);
  }
}
