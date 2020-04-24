import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';

@classic
export default class TimetableCalendar extends Component {
  @action
  calendarRemoveOccurrence() {}

  @action
  calendarEditOccurrence() {}

  @action
  calendarUpdateOccurrence() {}

  @action
  calendarAddOccurrence() {}

  @action
  calendarClickOccurrence() {}

  @action
  onTypeChange() {}

  @action
  calendarNavigate(event) {
    console.log(`on navigate: ${event.start}, ${event.end}`); // eslint-disable-line no-console
    let start = event.start.format('YYYY-MM-DD');
    this.reloadCalendar({ start: start, view: event.view});
  }
}
