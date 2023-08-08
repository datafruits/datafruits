import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

interface RandomPasswordMessageSignature {
  Args: {};
}

export default class RandomPasswordMessage extends Component<RandomPasswordMessageSignature> {
  @service declare intl: any;
  get randomMessage() {
    const n = Math.floor(Math.random() * 7);
    return this.intl.t(`funny_password_msgs.${n}`);
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    RandomPasswordMessage: typeof RandomPasswordMessage;
  }
}
  
