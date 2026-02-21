import { Adapter } from '../../../framework/index.js';

export default class WikiPageAdapter extends Adapter {
  namespace = 'api';

  urlForCreateRecord() {
    return 'api/wiki_pages';
  }
}
