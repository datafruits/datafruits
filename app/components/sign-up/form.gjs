import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import { Input } from "@ember/component";
import { LinkTo } from "@ember/routing";
import ValidatedField from "../validated-field.gjs";
import or from "ember-truth-helpers/helpers/or";
import not from "ember-truth-helpers/helpers/not";

export default class SignUpFormComponent extends Component {<template>{{#if @changeset.errors}}
  <div class="text-red">
    {{t "signup.error"}}
  </div>
{{/if}}
<form {{on "submit" this.submit}}>
  <div>
    <label class="block text-sm font-bold mb-2" for="user-email">{{t "signup.email"}}</label>
    <Input class="form-input focus:outline-none focus:shadow-outline" id="user-email" @type="text" autofocus={{true}} data-test-email {{on "change" this.updateEmail}} />
  </div>
  {{#if this.emailValidationErrors}}
    <div class="text-red-700">
      {{#each this.emailValidationErrors as |message|}}
        <div class="error item">{{message}}</div>
      {{/each}}
    </div>
  {{/if}}

  {{#if this.emailExists}}
    <LinkTo @route="home.password-reset">
      {{t "signup.email_exists"}}
    </LinkTo>
  {{/if}}
  <div>
    <label class="block text-sm font-bold mb-2" for="user-email">{{t "signup.username"}}</label>
    <Input class="form-input focus:outline-none focus:shadow-outline" id="user-username" @type="text" autofocus={{true}} data-test-username {{on "change" this.updateUsername}} />
  </div>
  {{#if this.usernameValidationErrors}}
    <div class="text-red-700">
      {{#each this.usernameValidationErrors as |message|}}
        <div class="error item">{{message}}</div>
      {{/each}}
    </div>
  {{/if}}
  <div>
    <ValidatedField @type="password" @changeset={{@changeset}} @property="password" @updateProperty={{this.updateProperty}} data-test-password />
  </div>
  <div>
     <label for="min-age">{{t "signup.min_age"}}</label>
      <Input @checked={{this.minAge}} @type="checkbox" name="min-age" data-test-age />
  </div>
  <div>
    <label for="coc-checkbox"> <a href="https://datafruits.fm/coc" target="blank">{{t "djinquiry.coc_accept"}}</a></label>
    <Input @type="checkbox" @checked={{this.cocAccepted}} name="coc-checkbox" data-test-coc />
  </div>
  {{#if this.everythingLooksNice}}
    <div class="bleed text-2xl">
      <span class="very-nice">{{t "signup.nice"}}</span>
    </div>
  {{/if}}
  <div class="mt-2">
    <input type="submit" value="{{t "signup.submit"}}" class="cool-button" disabled={{or (or (or @changeset.isInvalid @changeset.isSaving) (not this.cocAccepted)) (not this.minAge)}} data-test-submit>
  </div>
</form></template>
  @tracked cocAccepted = false;
  @tracked minAge = false;

  @service
  session;

  @service
  router;

  @service
  currentUser;

  @service
  chat;

  get emailExists() {
    let changeset = this.args.changeset;
    if (changeset.get('errors')) {
      let error = changeset.get('errors').find((error) => {
        return error.key === 'email';
      });
      if (error) {
        return error.validation[0] === 'Account with this email already exists.';
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  get emailValidationErrors() {
    let errors = this.args.changeset.errors.find((error) => {
      return error.key === 'email';
    });
    if (errors) {
      return errors.validation;
    } else {
      return null;
    }
  }

  get usernameValidationErrors() {
    let errors = this.args.changeset.errors.find((error) => {
      return error.key === 'username';
    });
    if (errors) {
      return errors.validation;
    } else {
      return null;
    }
  }

  get everythingLooksNice() {
    return this.args.changeset.isValid && !this.args.changeset.isSaving && this.cocAccepted && this.minAge;
  }

  _updateEmail() {
    if (this.email && this.email.length > 5) {
      this.args.changeset.set('email', this.email);
    }
  }

  @action
  updateEmail(event) {
    this.email = event.target.value;
    debounce(this, this._updateEmail, 500);
  }

  _updateUsername() {
    this.args.changeset.set('username', this.username);
  }

  @action updateUsername(event) {
    this.username = event.target.value;
    debounce(this, this._updateUsername, 500);
  }

  @action
  updateProperty(property, value) {
    let changeset = this.args.changeset;
    changeset.set(property, value);
  }

  @action
  submit(event) {
    event.preventDefault();
    let changeset = this.args.changeset;
    changeset.validate().then(() => {
      if (changeset.isValid) {
        changeset
          .save()
          .then(() => {
            //login user then transition to chat ??
            let nick = changeset.get('username');
            let pass = changeset.get('password');
            return this.session
              .authenticate('authenticator:devise', nick, pass)
              .then(() => {
                this.currentUser.load().then(() => {
                  this.chat.join(this.currentUser.user.username, this.session.data.authenticated.token);
                  return true;
                });
              })
              .catch((reason) => {
                console.log(reason);
                alert('Wrong password');
                return false;
              });
          })
          .catch((error) => {
            console.log(error.errors);
            alert('couldnt save user!');
          });
      } else {
        console.log('changeset invalid');
        console.log(changeset.get('errors'));
      }
    });
  }
}
