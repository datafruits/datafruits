import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';

export default class ChatUsernameComponent extends Component {
  @tracked showingDjInfo = false;

  get isDj() {
    if (!this.args.role) return false;
    return this.args.role.includes('dj') || this.args.role.includes('admin');
  }

  @action
  showUserInfo() {
    if (!this.showingDjInfo) {
      this.showingDjInfo = true;
    }
  }

  @action
  hideUserInfo() {
    debounce(this, '_hideUserInfo', 200);
  }

  _hideUserInfo() {
    this.showingDjInfo = false;
  }
}
