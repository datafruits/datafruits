import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class ChatController extends Controller {
  @service
  fastboot;

  @computed('fastboot')
  get isNotFastboot() {
    return !this.get('fastboot.isFastBoot');
  }
}
