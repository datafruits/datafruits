import ApplicationAdapter from './application';

export default class Track extends ApplicationAdapter {
  namespace = 'api';

  urlForQuery(query) {
    console.log(query);
    let djId = query.dj;
    let page = query.page || 1;
    if(djId) {
      return `${this.urlPrefix()}/djs/${djId}/episodes?page=${page}`;
    } else {
      return `${this.urlPrefix()}/tracks?page=${page}`;
    }
  }
}
