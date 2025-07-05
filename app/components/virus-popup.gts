import Component from '@glimmer/component';
import { action } from '@ember/object';
import Modal from "./ui/modal.ts";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";

interface VirusPopupSignature {
  Args: {
    toggleModal: any;
  };
}

export default class VirusPopup extends Component<VirusPopupSignature> {<template><Modal @toggleModal={{@toggleModal}}>
  <div {{didInsert this.didInsert}} class="modal-body m-1">
    <h1 style="bleed">CONGRATULATION</h1>
    <a href="https://shrimpshake.co" target="_blank" rel="noopener noreferrer">
      <marquee>
        <img src="/assets/images/emojis/acid.gif" />
      </marquee>
    </a>
    <audio style="display:none;" src="/assets/sfx/congratz.mp3" id="virus-message" />
  </div>
</Modal>
</template>
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

