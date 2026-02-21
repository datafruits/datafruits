import { Adapter } from '../../framework/index.js';

export default class ForumThreadAdapter extends Adapter {
  namespace = 'api';

  urlForCreateRecord() {
    return 'api/forum_threads';
  }
}
