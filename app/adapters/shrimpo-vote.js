import { Adapter } from '../../framework/index.js';

export default class ShrimpoVoteAdapter extends Adapter {
  namespace = 'api';

  urlForCreateRecord(_type, record) {
    const shrimpoEntryId = record?.shrimpoEntry?.slug;
    const shrimpoId = record?.shrimpoEntry?.shrimpoSlug;
    return `api/shrimpos/${shrimpoId}/shrimpo_entries/${shrimpoEntryId}/shrimpo_votes`;
  }
}
