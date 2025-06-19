import ApplicationAdapter from './application';

export default class ScheduledShow extends ApplicationAdapter {
  namespace = 'api';

  urlForQuery(query) {
    if (query.my) {
      return `${this.urlPrefix()}/my_shows`;
    } else {
      return `${this.urlPrefix()}/show_series`;
    }
  }

  urlForCreateRecord() {
    return `${this.urlPrefix()}/my_shows`;
  }

  urlForUpdateRecord(id, modelName, snapshot) {
    return `${this.urlPrefix()}/my_shows/${id}`;
  }

  urlForFindRecord(id, modelName, snapshot) {
    if (snapshot.adapterOptions?.my) {
      return `${this.urlPrefix()}/my_shows/${id}`;
    } else {
      return `${this.urlPrefix()}/show_series/${id}`;
    }
  }
}
