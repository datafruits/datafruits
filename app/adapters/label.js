import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class Label extends ApplicationAdapter {
  urlForQuery() {
    return `${this.urlPrefix()}/api/labels`;
  }
}
