import ApplicationAdapter from './application';

export default class HostApplication extends ApplicationAdapter {
  urlForCreateRecord() {
    return `${this.urlPrefix()}/host_applications`;
  }
}
