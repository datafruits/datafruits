import ApplicationAdapter from './application';
import classic from 'ember-classic-decorator';

@classic
export default class ForumThread extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/forum_threads`;
  }
}
