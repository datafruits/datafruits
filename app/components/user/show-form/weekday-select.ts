import Component from '@glimmer/component';
import type ShowSeries from 'datafruits13/models/show-series';

interface UserShowFormWeekdaySelectArgs {
  show: ShowSeries;
}

export default class UserShowFormWeekdaySelect extends Component<UserShowFormWeekdaySelectArgs> {
  weekdays = {
    'Sunday': 'sunday',
    'Monday': 'monday',
    'Tuesday': 'tuesday',
    'Wednesday': 'wednesday',
    'Thursday': 'thursday',
    'Friday': 'friday',
    'Saturday': 'saturday'
  };
}

