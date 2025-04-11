import ApplicationAdapter from './application';

export default class Label extends ApplicationAdapter {
  urlForQuery() {
    return `${this.urlPrefix()}/api/labels`;
  }
}
