import { Adapter } from '../../../framework/index.js';

export default class ShrimpoEntryAdapter extends Adapter {
  namespace = 'api';

  urlForFindRecord(id, _type, options) {
    return `api/shrimpos/${options?.shrimpo_id}/shrimpo_entries/${id}`;
  }

  urlForCreateRecord(_type, record) {
    const shrimpoId = record?.shrimpo?.slug ?? record?.shrimpoSlug;
    return `api/shrimpos/${shrimpoId}/shrimpo_entries`;
  }
}
