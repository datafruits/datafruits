import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import ChatService from 'datafruits13/services/chat';

export default class ChatSettings extends Component {
  @service declare chat: ChatService;

  @tracked declare showingDialog: boolean;
  
  get gearIcon() {
    return formatEmojiHtml(":gear:")
  }

  @action
  toggleDialog() {
    this.showingDialog = !this.showingDialog;
  }

  @action
  closeDialog() {
    this.showingDialog = false;
  }
  
  @action
  toggleGifsEnabled() {
    this.chat.gifsEnabled = !this.chat.gifsEnabled;
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ChatSettings: typeof ChatSettings;
  }
}
  