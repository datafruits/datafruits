import { Adapter } from '../../../framework/index.js';

export default class DjAdapter extends Adapter {
  namespace = 'api';

  urlForQueryRecord(query) {
    return `api/djs/${query.name}`;
  }
}
