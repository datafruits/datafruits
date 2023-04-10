import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';

export default class LoginModalComponent extends Component {
  @action
  submit(event) {
    event.preventDefault();
    if (this.args.login(this.username, this.pass)) {
      this.args.toggleModal();
    }
  }

}
