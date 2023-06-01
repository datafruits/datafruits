import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class EmojiSelectorGifComponent extends Component {
  @action
  closeDialogAndSendGif(gif) {
    this.args.sendGif(gif);
    this.args.closeDialog();
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    EmojiSelectorGifComponent: typeof EmojiSelectorGifComponent;
  }
}
  
