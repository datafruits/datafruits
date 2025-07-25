import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default class SignUpFormComponent extends Component {
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
