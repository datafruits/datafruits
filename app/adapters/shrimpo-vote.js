import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class ShrimpoVote extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord(modelName, snapshot) {
    let shrimpoEntryId = snapshot.belongsTo('shrimpoEntry').attributes().slug;
    let shrimpoId = snapshot.belongsTo('shrimpoEntry').attributes().shrimpoSlug;
    return `${this.urlPrefix()}/shrimpos/${shrimpoId}/shrimpo_entries/${shrimpoEntryId}/shrimpo_votes`;
  }
}
