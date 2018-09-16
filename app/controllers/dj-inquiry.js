import Controller from '@ember/controller';

export default Controller.extend({
  intervals: ["weekly", "biweekly", "monthly", "other"],
  daysOfWeek: [],
  actions: {
    submit(){
      let hostApplication = this.get('model');
      // set timezone
      hostApplication.set('timeZone', jstz.determine().name());
      hostApplication.save();
    }
  }
});
