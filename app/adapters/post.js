import ApplicationAdapter from './application';

export default class Post extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/posts`;
  }
}
