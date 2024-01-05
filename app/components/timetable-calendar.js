import Component from '@glimmer/component';
import { action } from '@ember/object';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

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
    query.timezone = dayjs.tz.guess();
    query.start = dayjs(new Date()).startOf('day').format('YYYY-MM-DD');
    query.end = dayjs(query.start).endOf('month').add(1, 'month').format('YYYY-MM-DD');
    let showsPromise = this.store.query('scheduled-show', query).then((result) => {
      this.shows = result;
    });

    return showsPromise;
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TimetableCalendarComponent: typeof TimetableCalendarComponent;
  }
}

