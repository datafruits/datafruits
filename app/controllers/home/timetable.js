import Controller from '@ember/controller';
import { computed } from '@ember/object';
import QueryParams from 'ember-parachute';
import moment from 'moment';

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
  query: computed('start', 'view', function(){
    return { start: this.start, view: this.view };
  }),
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
