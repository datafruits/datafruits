import Controller from '@ember/controller';

export default Controller.extend({
  start: null,
  end: null,
  view: null,
  actions: {
    reloadCalendar(params){
      this.set('start', params.start);
      this.set('end', params.end);
      this.set('view', params.view);
    },
    calendarTypeChange(type){
      this.set('view', type);
    }
  }
});
