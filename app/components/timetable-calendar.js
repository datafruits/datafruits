import Component from '@glimmer/component';
import { action } from '@ember/object';
import moment from 'moment';
import jstz from 'jstimezonedetect';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TimetableCalendarComponent extends Component {
  @service
  store;

  @tracked shows;
  get groupedShows() {
    return this.shows.reduce((accumulator, show) => {
      let date = new Date(show.start);
      //remove time
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      accumulator[date] = accumulator[date] || [];
      accumulator[date].pushObject(show);
      return accumulator;
    }, Object.create(null));
  }

  @action
  async fetchShows(query) {
    query.timezone = jstz.determine().name();
    // const start = query.start;
    // if (query.view === 'month') {
    //   query.start = moment(start).startOf('month').subtract(1, 'month').format('YYYY-MM-DD');
    //   query.end = moment(start).endOf('month').add(1, 'month').format('YYYY-MM-DD');
    // } else {
    //   query.start = moment(start).startOf('week').subtract(1, 'week').format('YYYY-MM-DD');
    //   query.end = moment(start).endOf('week').add(1, 'week').format('YYYY-MM-DD');
    // }
    query.start = moment(new Date()).startOf('day').toString();
    query.end = moment(query.start).endOf('month').add(1, 'month').format('YYYY-MM-DD');
    let showsPromise = this.store.query('scheduled-show', query).then((result) => {
      this.shows = result;
    });

    return showsPromise;
  }
}
