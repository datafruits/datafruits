import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class ShrimpoEntry extends ApplicationAdapter {
  namespace = 'api';

  urlForFindRecord(id, modelName, snapshot) {
    // TODO is this nested route pointless??
    return `${this.urlPrefix()}/shrimpos/${snapshot.adapterOptions.shrimpo_id}/shrimpo_entries/${id}`;
  }

  urlForCreateRecord(modelName, snapshot) {
    let shrimpoId = snapshot.belongsTo('shrimpo').attributes().slug;
    return `${this.urlPrefix()}/shrimpos/${shrimpoId}/shrimpo_entries`;
  }
}
