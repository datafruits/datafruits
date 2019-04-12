import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  session: service(),
  fastboot: service(),
  isNotFastboot: computed('fastboot', function(){
    return !this.get('fastboot.isFastBoot');
  }),
  actions: {
    authenticate(nick, pass) {
      this.get('session').authenticate('authenticator:devise', nick, pass).catch((reason) => {
        console.log(reason);
      });
    }
  }
});
