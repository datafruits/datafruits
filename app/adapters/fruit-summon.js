import ApplicationAdapter from './application';
import classic from 'ember-classic-decorator';

@classic
export default class FruitSummon extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/fruit_summons`;
  }
}
