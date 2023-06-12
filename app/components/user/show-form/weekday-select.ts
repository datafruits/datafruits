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


  declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
      UserShowFormWeekdaySelect: typeof UserShowFormWeekdaySelect;
    }
  }
  

