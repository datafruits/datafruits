import ApplicationAdapter from './application';

export default class Dj extends ApplicationAdapter {
  namespace = 'api';

  urlForQueryRecord(query) {
    return `${this.urlPrefix()}/djs/${query.name}`;
  }
}
