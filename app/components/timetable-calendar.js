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

  @tracked shows = [];
  @tracked viewMode = 'schedule';

  weekdays = [
    { index: 0, label: 'Sun' },
    { index: 1, label: 'Mon' },
    { index: 2, label: 'Tue' },
    { index: 3, label: 'Wed' },
    { index: 4, label: 'Thu' },
    { index: 5, label: 'Fri' },
    { index: 6, label: 'Sat' },
  ];

  monthlyCadenceOptions = ['First', 'Second', 'Third', 'Fourth', 'Last'];

  get isAvailabilityView() {
    return this.viewMode === 'availability';
  }

  get currentTimezone() {
    return dayjs.tz.guess();
  }

  get timeSlotAvailabilityRows() {
    const occupiedHours = this.occupiedHourKeys;

    return Array.from({ length: 24 }, (_, hour) => {
      return {
        hour,
        label: dayjs().hour(hour).minute(0).format('h A'),
        cells: this.weekdays.map((day) => {
          return this.getAvailabilityForSlot(day.index, hour, occupiedHours);
        }),
      };
    });
  }

  get groupedShows() {
    return this.shows.reduce((accumulator, show) => {
      let date = new Date(show.start);
      //remove time
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      accumulator[date] = accumulator[date] || [];
      accumulator[date].push(show);
      return accumulator;
    }, Object.create(null));
  }

  get occupiedHourKeys() {
    const keys = new Set();

    this.shows.forEach((show) => {
      const start = dayjs(show.start);
      const end = dayjs(show.end);

      if (!start.isValid() || !end.isValid() || !end.isAfter(start)) {
        return;
      }

      let hour = start.startOf('hour');
      while (hour.isBefore(end)) {
        keys.add(this.hourKey(hour, hour.hour()));
        hour = hour.add(1, 'hour');
      }
    });

    return keys;
  }

  getAvailabilityForSlot(weekday, hour, occupiedHours) {
    return {
      weekday,
      hour,
      weeklyAvailable: this.isWeeklySlotAvailable(weekday, hour, occupiedHours),
      biweeklyAvailable: this.isBiweeklySlotAvailable(weekday, hour, occupiedHours),
      monthlyAvailable: this.isMonthlySlotAvailable(weekday, hour, occupiedHours),
    };
  }

  isWeeklySlotAvailable(weekday, hour, occupiedHours) {
    return !this.weeklyCandidateDates(weekday).some((date) =>
      occupiedHours.has(this.hourKey(date, hour)),
    );
  }

  isBiweeklySlotAvailable(weekday, hour, occupiedHours) {
    return [0, 1].some((parity) => {
      return !this.biweeklyCandidateDates(weekday, parity).some((date) =>
        occupiedHours.has(this.hourKey(date, hour)),
      );
    });
  }

  isMonthlySlotAvailable(weekday, hour, occupiedHours) {
    return this.monthlyCadenceOptions.some((cadence) => {
      return !this.monthlyCandidateDates(weekday, cadence).some((date) =>
        occupiedHours.has(this.hourKey(date, hour)),
      );
    });
  }

  get calendarWindowStart() {
    return dayjs().startOf('day');
  }

  get calendarWindowEnd() {
    return this.calendarWindowStart.add(3, 'month').endOf('month');
  }

  weeklyCandidateDates(weekday) {
    const matches = [];
    let date = this.calendarWindowStart.startOf('day');
    while (date.isBefore(this.calendarWindowEnd) || date.isSame(this.calendarWindowEnd, 'day')) {
      if (date.day() === weekday) {
        matches.push(date);
      }
      date = date.add(1, 'day');
    }
    return matches;
  }

  biweeklyCandidateDates(weekday, parity) {
    const weekStart = this.calendarWindowStart.startOf('week');
    return this.weeklyCandidateDates(weekday).filter((date) => {
      const weekOffset = date.startOf('week').diff(weekStart, 'week');
      return weekOffset % 2 === parity;
    });
  }

  monthlyCandidateDates(weekday, cadence) {
    const matches = [];
    let month = this.calendarWindowStart.startOf('month');
    while (month.isBefore(this.calendarWindowEnd) || month.isSame(this.calendarWindowEnd, 'month')) {
      const date = this.nthWeekdayInMonth(month, weekday, cadence);
      if (date) {
        matches.push(date.startOf('day'));
      }
      month = month.add(1, 'month');
    }
    return matches;
  }

  nthWeekdayInMonth(month, weekday, cadence) {
    if (cadence === 'Last') {
      let date = month.endOf('month').startOf('day');
      while (date.day() !== weekday) {
        date = date.subtract(1, 'day');
      }
      return date;
    }

    let date = month.startOf('month').startOf('day');
    while (date.day() !== weekday) {
      date = date.add(1, 'day');
    }

    const cadenceIndex = this.monthlyCadenceOptions.indexOf(cadence);
    const candidate = date.add(cadenceIndex, 'week');
    if (candidate.month() !== month.month()) {
      return null;
    }

    return candidate;
  }

  hourKey(date, hour) {
    return `${date.format('YYYY-MM-DD')}-${hour}`;
  }

  @action
  setViewMode(viewMode) {
    this.viewMode = viewMode;
  }

  get fetchShows() {
    const query = {};
    query.timezone = dayjs.tz.guess();
    query.start = dayjs(new Date()).startOf('day').format('YYYY-MM-DD');
    query.end = dayjs(query.start).add(3, 'month').endOf('month').format('YYYY-MM-DD');
    let showsPromise = this.store.query('scheduled-show', query).then((result) => {
      this.shows = result; // eslint-disable-line
    });

    return showsPromise;
  }
}
