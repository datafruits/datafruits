import ApplicationAdapter from './application';

export default class Podcast extends ApplicationAdapter {
  urlForQuery() {
    return `${this.urlPrefix()}/api/archives`;
  }
}
