import Controller from '@ember/controller';
import jstz from 'jstimezonedetect';

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
      hostApplication.set('timeZone', jstz.determine().name());
      hostApplication.save();
    },
  },
});
