import { Adapter } from '../../framework/index.js';

export default class LabelAdapter extends Adapter {
  urlForQuery() {
    return `api/labels`;
  }
}
