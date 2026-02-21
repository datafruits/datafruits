import { Adapter } from '../../../framework/index.js';

export default class ShowSeriesAdapter extends Adapter {
  namespace = 'api';

  urlForQuery(query) {
    if (query.my) {
      return 'api/my_shows';
    } else {
      return 'api/show_series';
    }
  }

  urlForCreateRecord() {
    return 'api/my_shows';
  }

  urlForUpdateRecord(id) {
    return `api/my_shows/${id}`;
  }

  urlForFindRecord(id, _type, options) {
    if (options?.my) {
      return `api/my_shows/${id}`;
    } else {
      return `api/show_series/${id}`;
    }
  }
}
