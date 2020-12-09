import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TimetableCalendarComponent extends Component {
  @action
  async fetchData(query) {
    query.timezone = jstz.determine().name();
    const start = query.start;
    if (query.view === 'month') {
      query.start = moment(start).startOf('month').subtract(1, 'month').format('YYYY-MM-DD');
      query.end = moment(start).endOf('month').add(1, 'month').format('YYYY-MM-DD');
    } else {
      query.start = moment(start).startOf('week').subtract(1, 'week').format('YYYY-MM-DD');
      query.end = moment(start).endOf('week').add(1, 'week').format('YYYY-MM-DD');
    }
    let shows = this.store.query('scheduled-show', query);

    return shows;
  }
}
