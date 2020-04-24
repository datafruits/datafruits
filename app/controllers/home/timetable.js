import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import Controller from '@ember/controller';
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

@classic
export default class TimetableController extends Controller.extend(TimetableQueryParams.Mixin) {
  @computed('start', 'view')
  get query() {
    return { start: this.start, view: this.view };
  }

  @action
  reloadCalendar(params) {
    this.set('start', params.start);
    this.set('view', params.view);
  }

  @action
  calendarTypeChange(type) {
    this.set('view', type);
  }
}
