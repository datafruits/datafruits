import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class Dj extends ApplicationAdapter {
  namespace = 'api';

  urlForQueryRecord(query) {
    return `${this.urlPrefix()}/djs/${query.name}`;
  }
}
