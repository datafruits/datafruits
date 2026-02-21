import { Adapter } from '../../framework/index.js';

export default class UserAdapter extends Adapter {
  urlForQuery() {
    return 'api/djs';
  }

  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return 'users/current_user';
    } else {
      return `api/djs/${query.id}`;
    }
  }

  urlForCreateRecord() {
    return 'api/listeners';
  }

  urlForUpdateRecord() {
    return 'users/current_user';
  }
}
