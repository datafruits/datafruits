import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class Shrimpo extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    let shrimpoId = 1 // TODO
    return `${this.urlPrefix()}/shrimpos/${shrimpoId}/shrimpo_entries`;
  }
}
