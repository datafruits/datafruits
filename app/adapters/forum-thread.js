import ApplicationAdapter from './application';

export default class ForumThread extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/forum_threads`;
  }
}
