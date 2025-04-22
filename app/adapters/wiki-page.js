import ApplicationAdapter from './application';

export default class WikiPage extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/wiki_pages`;
  }
}
