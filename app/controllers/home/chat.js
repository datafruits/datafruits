import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  session: service(),
  fastboot: service(),
  chat: service(),
  isNotFastboot: computed('fastboot', function(){
    return !this.get('fastboot.isFastBoot');
  }),
  actions: {
    authenticate(nick, pass) {
      this.get('session').authenticate('authenticator:devise', nick, pass).then(() => {
        console.log('logged in!');
        const token = this.session.data.authenticated.token;
        this.chat.push("authorize", { user: nick, timestamp: Date.now(), token: token });
      }).catch((reason) => {
        console.log(reason);
      });
    }
  }
});
