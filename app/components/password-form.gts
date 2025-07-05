import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';
import fetch from 'fetch';
import { on } from "@ember/modifier";
import t from "ember-intl/helpers/t";
import { Input } from "@ember/component";

interface PasswordFormSignature {
  Args: {
    token: string;
  };
}

export default class PasswordForm extends Component<PasswordFormSignature> {<template><form {{on "submit" this.submit}}>
  <div>
    <label class="block text-sm font-bold mb-2" for="password">{{t "password_new.password"}}</label>
    <Input class="form-input focus:outline-none focus:shadow-outline" id="password" @type="password" @value={{this.password}} autofocus={{true}} autocorrect="off" autocapitalize="none" data-test-password />
  </div>
  <div>
    <label class="block text-sm font-bold mb-2" for="password-confirmation">{{t "password_new.password_confirmation"}}</label>
    <Input class="form-input focus:outline-none focus:shadow-outline" id="password-confirmation" @type="password" @value={{this.passwordConfirmation}} autofocus={{true}} autocorrect="off" autocapitalize="none" data-test-password-confirmation />
  </div>
  {{#each this.errors as |error|}}
    <div class="error">
      {{t error}}
    </div>
  {{/each}}
  <div class="flex items-center justify-between mt-2">
    <Input @type="submit" class="cool-button cursor-pointer" disabled={{this.cantSubmit}} data-test-submit-button @value={{t "password_new.submit"}} />
  </div>
</form>
</template>
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


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PasswordForm: typeof PasswordForm;
  }
}

