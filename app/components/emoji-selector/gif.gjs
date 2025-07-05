import Component from '@glimmer/component';
import { action } from '@ember/object';
import GiphySearch from "../giphy-search.gjs";

export default class EmojiSelectorGifComponent extends Component {<template><GiphySearch @sendGif={{this.closeDialogAndSendGif}} />
</template>
  @action
  closeDialogAndSendGif(gif) {
    this.args.sendGif(gif);
    this.args.closeDialog();
  }
}
