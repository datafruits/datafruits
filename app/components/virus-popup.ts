import Component from '@glimmer/component';
import { action } from '@ember/object';

interface VirusPopupArgs {
  toggleModal: any;
}

export default class VirusPopup extends Component<VirusPopupArgs> {
  @action
  didInsert(element: HTMLElement) {
    (element.querySelector("#virus-message") as HTMLAudioElement).play();
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    VirusPopup: typeof VirusPopup;
  }
}
  
