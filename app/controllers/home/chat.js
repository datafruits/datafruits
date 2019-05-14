import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  fastboot: service(),
  isNotFastboot: computed('fastboot', function(){
    return !this.get('fastboot.isFastBoot');
  }),
});
