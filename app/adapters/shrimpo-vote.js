import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class ShrimpoVote extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord(modelName, snapshot) {
    let shrimpoEntryId = snapshot.belongsTo('shrimpo-entry').attributes().slug;
    let shrimpoId = snapshot.belongsTo('shrimpo-entry').attributes().shrimpoSlug;
    return `${this.urlPrefix()}/shrimpos/${shrimpoId}/shrimpo_entries/${shrimpoEntryId}/votes`;
  }
}
