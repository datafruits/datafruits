import Controller from '@ember/controller';
//import computed from '@ember/object';

export default Controller.extend({
  intervals: ["daily", "weekly", "biweekly", "monthly", "other"],
  actions: {
    setInterval(event){
      const interval = event.target.value;
      this.set('model.interval', interval);
    },
    submit(){
      let hostApplication = this.get('model');
      hostApplication.set('timeZone', jstz.determine().name());
      const success = () => {
        console.log('success!');
      };
      const failure= () => {
        console.log('failed!');
      };
      hostApplication.save().then(success, failure);
    }
  }
});
