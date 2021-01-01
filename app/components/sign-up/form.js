import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SignUpFormComponent extends Component {
  @tracked cocAccepted = false;

  @service
  session;

  @service
  router;

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

  @action
  validateProperty(property) {
    let changeset = this.args.changeset;
    changeset.validate(property);
    console.log(`validated property: ${property}`);
    console.log(changeset.get('errors'));
    return changeset.validate(property);
  }

  @action
  updateProperty(property, value) {
    let changeset = this.args.changeset;
    changeset.set(property, value);
  }

  @action
  submit() {
    let changeset = this.args.changeset;
    changeset.validate().then(() => {
      console.log(changeset);
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
                const token = this.session.data.authenticated.token;
                this.chat.push('authorize_token', { user: nick, timestamp: Date.now(), token: token });
                this.router.transitionTo('chat');
                return true;
              })
              .catch((/*reason*/) => {
                alert('Wrong password');
                return false;
              });
          })
          .catch((error) => {
            alert('couldnt save user!');
            console.log(error);
          });
      } else {
        console.log('changeset invalid');
        console.log(changeset.get('errors'));
      }
    });
  }
}
