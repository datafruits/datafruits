import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class Shrimpo extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord(modelName, snapshot) {
    let shrimpoId = snapshot.belongsTo('shrimpo').attributes().slug;
    return `${this.urlPrefix()}/shrimpos/${shrimpoId}/shrimpo_entries`;
  }
}
