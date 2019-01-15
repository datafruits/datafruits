import Controller from '@ember/controller';
import QueryParams from 'ember-parachute';

export const TimetableQueryParams = new QueryParams({
  start: {
    defaultValue: moment().format('YYYY-MM-DD'),
    refresh: true
  },
  view: {
    defaultValue: 'week',
    refresh: true
  }
});

export default Controller.extend(TimetableQueryParams.Mixin, {
  actions: {
    reloadCalendar(params){
      this.set('start', params.start);
      this.set('view', params.view);
    },
    calendarTypeChange(type){
      this.set('view', type);
    }
  }
});
