import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class Podcast extends ApplicationAdapter {
  urlForQuery() {
    return `${this.urlPrefix()}/api/archives`;
  }
}
