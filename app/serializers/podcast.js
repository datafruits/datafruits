import ApplicationSerializer from './application';
import classic from 'ember-classic-decorator';

@classic
export default class PodcastSerializer extends ApplicationSerializer {
  normalizeQueryRecordResponse(store, primaryModelClass, payload /* id, requestType*/) {
    payload['podcast']['meta'] = payload['meta'];

    return super.normalizeQueryResponse(...arguments);
  }
}
