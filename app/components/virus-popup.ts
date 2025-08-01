import Component from '@glimmer/component';
import { action } from '@ember/object';

interface VirusPopupSignature {
  Args: {
    toggleModal: any;
  };
}

export default class VirusPopup extends Component<VirusPopupSignature> {
  @action
  didInsert(element: HTMLElement) {
    (element.querySelector("#virus-message") as HTMLAudioElement).play().catch((e) => {
      console.log("couldn't play message: ", e);
    });
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    VirusPopup: typeof VirusPopup;
  }
}

