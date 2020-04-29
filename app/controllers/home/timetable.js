import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { queryParam } from 'ember-parachute/decorators';
import moment from 'moment';

export default class TimetableController extends Controller {
  @queryParam({ refresh: true}) start = moment().format('YYYY-MM-DD');
  @queryParam({ refresh: true}) view = 'week';

  // @tracked start;
  // @tracked view;
  get query() {
    return { start: this.start, view: this.view };
  }

  @action
  reloadCalendar(params) {
    this.start = params.start;
    this.view = params.view;
  }

  @action
  calendarTypeChange(type) {
    this.view = type;
  }
}
