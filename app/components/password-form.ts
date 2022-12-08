import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';
import fetch from 'fetch';

interface PasswordFormArgs {
  token: string
}

export default class PasswordForm extends Component<PasswordFormArgs> {
  passwordResetUrl = `${ENV.API_HOST}/users/password`;

  @tracked password: string = "";
  @tracked passwordConfirmation: string = "";

  get errors(): string[] {
    const errors: string[] = [];
    if(this.password !== this.passwordConfirmation) {
      errors.push("password_reset.errors.no_match");
    }
    if(this.password.length < 8) {
      errors.push("password_reset.errors.too_short");
    }
    return errors;
  }

  @action
  submit(e: any) {
    e.preventDefault();
    const data = {
      user: {
        reset_password_token: this.args.token,
        password: this.password,
        passwordConfirmation: this.passwordConfirmation
      },
    };

    fetch(this.passwordResetUrl, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((data) => {
        if (data.status == 200) {
          alert('Password reset successfully!');
        } else {
          alert('Something went wrong!');
        }
      })
      .catch(() => {
        alert('Something went wrong!');
      });
  }
}
