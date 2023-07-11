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


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LoginModalComponent: typeof LoginModalComponent;
  }
}
  
