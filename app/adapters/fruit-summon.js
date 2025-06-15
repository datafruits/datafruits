import ApplicationAdapter from './application';

export default class FruitSummon extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/fruit_summons`;
  }
}
