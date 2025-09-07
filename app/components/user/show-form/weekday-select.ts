import Component from '@glimmer/component';
import { BufferedChangeset } from 'ember-changeset/types';

interface UserShowFormWeekdaySelectArgs {
  changeset: BufferedChangeset;
}

export default class UserShowFormWeekdaySelect extends Component<UserShowFormWeekdaySelectArgs> {
  // TODO i18n
  weekdays = {
    'Sunday': 'Sunday',
    'Monday': 'Monday',
    'Tuesday': 'Tuesday',
    'Wednesday': 'Wednesday',
    'Thursday': 'Thursday',
    'Friday': 'Friday',
    'Saturday': 'Saturday'
  };
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'User::ShowForm::WeekdaySelect': typeof UserShowFormWeekdaySelect;
  };;;;;;;;;;
}
