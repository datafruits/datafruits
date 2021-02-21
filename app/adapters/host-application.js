import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class HostApplication extends ApplicationAdapter {
  urlForCreateRecord() {
    return `${this.urlPrefix()}/host_applications`;
  }
}
