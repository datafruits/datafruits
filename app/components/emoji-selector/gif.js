import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class EmojiSelectorGifComponent extends Component {
  @action
  closeDialogAndSendGif(gif) {
    this.args.sendGif(gif);
    this.args.closeDialog();
  }
}
