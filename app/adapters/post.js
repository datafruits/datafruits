import ApplicationAdapter from './application';
import classic from 'ember-classic-decorator';

@classic
export default class Post extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/posts`;
  }
}
