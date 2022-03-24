import { inject as service } from '@ember/service';
import EmberPageTitleService from 'ember-page-title/services/page-title';

export default class PageTitleService extends EmberPageTitleService {
  @service
  metadata;

  titleDidUpdate(title) {
    document.title = `${title} - ${this.metadata.title}`;
  }
}
