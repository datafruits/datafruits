import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class Podcast extends ApplicationAdapter {
  urlForQueryRecord() {
    return `${this.urlPrefix()}/podcasts/datafruits`;
  }

  urlForQuery() {
    return `${this.urlPrefix()}/podcasts/datafruits`;
  }
}
