import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ChatUsernameComponent extends Component {
  @tracked showingDjInfo = false;

  get isDj() {
    if (!this.args.role) return false;
    return this.args.role.includes('dj') || this.args.role.includes('admin');
  }

  @action
  showUserInfo() {
    this.showingDjInfo = true;
    console.log('mouseenter');
  }

  @action
  hideUserInfo() {
    this.showingDjInfo = false;
    console.log('mouseleave');
  }
}
