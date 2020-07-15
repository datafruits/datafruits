import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class ChatController extends Controller {
  @service
  fastboot;

  @service
  chat;

  @service
  session;

  @computed('fastboot.isFastBoot')
  get isNotFastboot() {
    return !this.fastboot.isFastBoot;
  }

  @action
  authenticate(nick, pass) {
    this.session
      .authenticate('authenticator:devise', nick, pass)
      .then(() => {
        console.log('logged in!');
        const token = this.session.data.authenticated.token;
        this.chat.push('authorize', { user: nick, timestamp: Date.now(), token: token });
      })
      .catch((reason) => {
        console.log(reason);
      });
  }
}
