import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class RandomPasswordMessage extends Component {
  @service declare intl: any;
  get randomMessage() {
    const n = Math.floor(Math.random() * 7);
    return this.intl.t(`funny_password_msgs.${n}`);
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    RandomPasswordMessage: typeof RandomPasswordMessage;
  };;;;;;;;;;
}

