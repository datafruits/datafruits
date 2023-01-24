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
}
