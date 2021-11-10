import ApplicationSerializer from './application';
import classic from 'ember-classic-decorator';

@classic
export default class PodcastSerializer extends ApplicationSerializer {
  normalizeQueryResponse(store, primaryModelClass, payload /* id, requestType*/) {
    payload['podcast'] = [payload['podcast']];
    return super.normalizeQueryResponse(...arguments);
  }
}
