import Controller from '@ember/controller';
import dayjs from 'dayjs';
import utc  from 'dayjs/plugin/utc';
import timezone  from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('intervals', ['daily', 'weekly', 'biweekly', 'monthly', 'other']);
  },
  actions: {
    setInterval(event) {
      const interval = event.target.value;
      this.set('model.interval', interval);
    },
    submit() {
      let hostApplication = this.model;
      hostApplication.set('timeZone', dayjs.tz.guess());
      hostApplication.save();
    },
  },
});
