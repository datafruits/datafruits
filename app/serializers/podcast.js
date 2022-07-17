import JSONSerializer from '@ember-data/serializer/json';
import classic from 'ember-classic-decorator';

@classic
export default class PodcastSerializer extends JSONSerializer {
  normalizeQueryRecordResponse(store, primaryModelClass, payload /* id, requestType*/) {
    payload['podcast']['meta'] = payload['meta'];

    return super.normalizeQueryResponse(...arguments);
  }
}
