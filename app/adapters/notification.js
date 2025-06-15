import ApplicationAdapter from './application';

export default class Notification extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/notification`;
  }
}
