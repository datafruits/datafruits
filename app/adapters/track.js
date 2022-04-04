import ApplicationAdapter from './application';
import classic from 'ember-classic-decorator';

@classic
export default class Track extends ApplicationAdapter {
  namespace = 'api';

  urlForQuery(query) {
    console.log(query);
    let djId = query.dj;
    let page = query.page || 1;
    return `${this.urlPrefix()}/djs/${djId}/tracks?page=${page}`;
  }
}
