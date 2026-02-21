import { Adapter } from '../../../framework/index.js';

export default class PodcastAdapter extends Adapter {
  urlForQuery() {
    return `api/archives`;
  }
}
