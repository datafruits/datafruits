import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import dayjs from 'dayjs';
import utc  from 'dayjs/plugin/utc';
import timezone  from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default Component.extend({
  store: service(),
  fastboot: service(),
  tagName: '',
  init() {
    this._super(...arguments);
    this.data = [];
  },

  didReceiveAttrs() {
    let query = this.query;
    this.fetchData.perform(query);
  },

  fetchData: task(function* (query) {
    if (!this.fastboot.isFastBoot) {
      if (document.getElementsByClassName('as-calendar-timetable__main').length) {
        document.getElementsByClassName('as-calendar-timetable__main')[0].classList.add('bleed');
      }
    }
    yield timeout(1000);
    query.timezone = dayjs.tz.guess();
    const start = query.start;
    if (query.view === 'month') {
      query.start = dayjs(start).startOf('month').subtract(1, 'month').format('YYYY-MM-DD');
      query.end = dayjs(start).endOf('month').add(1, 'month').format('YYYY-MM-DD');
    } else {
      query.start = dayjs(start).startOf('week').subtract(1, 'week').format('YYYY-MM-DD');
      query.end = dayjs(start).endOf('week').add(1, 'week').format('YYYY-MM-DD');
    }
    let shows = this.store.query('scheduled-show', query).then((shows) => {
      return shows;
    });
    let resolvedShows = yield shows;
    if (!this.fastboot.isFastBoot) {
      document.getElementsByClassName('as-calendar-timetable__main')[0].classList.remove('bleed');
    }
    return this.set('data', resolvedShows);
  }).restartable(),
});
