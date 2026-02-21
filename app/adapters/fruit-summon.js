import { Adapter } from '../../framework/index.js';

export default class FruitSummonAdapter extends Adapter {
  namespace = 'api';

  urlForCreateRecord() {
    return 'api/fruit_summons';
  }
}
