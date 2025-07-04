import ApplicationAdapter from './application';

export default class ShrimpoVote extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord(modelName, snapshot) {
    let shrimpoEntryId = snapshot.belongsTo('shrimpoEntry').attributes().slug;
    let shrimpoId = snapshot.belongsTo('shrimpoEntry').attributes().shrimpoSlug;
    return `${this.urlPrefix()}/shrimpos/${shrimpoId}/shrimpo_entries/${shrimpoEntryId}/shrimpo_votes`;
  }
}
