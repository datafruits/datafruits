import { BaseService, service } from '../../../framework/index.js';

export default class PageTitleService extends BaseService {
  @service('metadata')
  metadata;

  _title = '';

  setTitle(parts) {
    this._title = parts.filter(Boolean).join(' | ');
    this._updateDocumentTitle();
  }

  _updateDocumentTitle() {
    if (typeof document !== 'undefined') {
      const metaTitle = this.metadata?.title ?? '';
      document.title = metaTitle
        ? `${this._title} - ${metaTitle}`
        : this._title;
    }
  }
}
