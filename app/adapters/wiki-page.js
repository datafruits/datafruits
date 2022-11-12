import ApplicationAdapter from './application';
import classic from 'ember-classic-decorator';

@classic
export default class WikiPage extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/wiki_pages`;
  }
}
