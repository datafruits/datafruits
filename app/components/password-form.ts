import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface PasswordFormArgs {
  token: string
}

export default class PasswordForm extends Component<PasswordFormArgs> {
  @tracked password: string = "";
  @tracked passwordConfirmation: string = "";

  get cantSubmit(): boolean {
    return false;
  }

  @action
  submit(e: any) {
    e.preventDefault();
    console.log(this.args.token);
  }
}
