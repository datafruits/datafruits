import { Adapter } from '../../../framework/index.js';

export default class TrackAdapter extends Adapter {
  namespace = 'api';

  urlForQuery(query) {
    console.log(query);
    let djId = query.dj;
    let page = query.page || 1;
    if (djId) {
      return `api/djs/${djId}/episodes?page=${page}`;
    } else {
      return `api/tracks?page=${page}`;
    }
  }
}
