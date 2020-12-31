import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';
import ENV from 'datafruits13/config/environment';
import fetch from 'fetch';

export default class PasswordResetController extends Controller {
  passwordResetUrl = `${ENV.API_HOST}/users/password`;

  @tracked
  email = '';

  get cantSubmit() {
    return isEmpty(this.email);
  }

  @action
  submit() {
    let data = {
      user: {
        email: this.email,
      },
    };

    fetch(this.passwordResetUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((data) => {
        if (data.status == 201) {
          alert('Password reset link sent!');
        } else {
          alert('Something went wrong!');
        }
      })
      .catch(() => {
        alert('Something went wrong!');
      });
  }
}
