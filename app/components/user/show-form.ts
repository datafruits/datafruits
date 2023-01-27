import Component from '@glimmer/component';
import { action } from '@ember/object';
import type ScheduledShow from 'datafruits13/models/scheduled-show';

interface UserShowFormArgs {
  show: ScheduledShow;
}

export default class UserShowForm extends Component<UserShowFormArgs> {
  @action
  saveShow() {
  }

  @action
  setRepeating(event: any) {
    this.args.show.repeating = event.target.value;
    if(this.args.show.repeating) {
      this.args.show.recurringInterval = 'week';
    }
  }

  @action
  setInterval(event: any) {
    this.args.show.recurringInterval = event.target.value;
  }
}
