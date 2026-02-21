import { Adapter } from '../../../framework/index.js';

export default class ScheduledShowAdapter extends Adapter {
  namespace = 'api';

  urlForFindRecord(id, _type, options) {
    return `api/show_series/${options?.show_series_id}/episodes/${id}`;
  }

  urlForQuery(query) {
    console.log('urlForQuery: ', query);
    const djId = query.dj;
    const id = query.id;
    const page = query.page || 1;
    if (query.start) {
      return 'api/scheduled_shows';
    } else if (djId) {
      return `api/djs/${djId}/episodes?page=${page}`;
    } else if (id) {
      return 'api/scheduled_shows';
    } else {
      return `api/show_series/${query.showSeries}/episodes`;
    }
  }

  urlForQueryRecord(query) {
    if (query.next) {
      return 'api/scheduled_shows/next';
    }
    return null;
  }

  urlForUpdateRecord(id, _type, record) {
    const showSeriesSlug = record?.showSeriesSlug
      ?? window.location.pathname.split('/user/my-shows/')[1]?.split('/episode/')[0];
    return `api/my_shows/${showSeriesSlug}/episodes/${record?.slug ?? id}`;
  }

  urlForDeleteRecord(id, _type, record) {
    const showSeriesSlug = record?.showSeriesSlug
      ?? window.location.pathname.split('/user/my-shows/')[1]?.split('/episode/')[0];
    return `api/my_shows/${showSeriesSlug}/episodes/${id}`;
  }
}
