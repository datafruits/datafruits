import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { Textcomplete } from '@textcomplete/core';
import { TextareaEditor } from '@textcomplete/textarea';
import { tracked } from '@glimmer/tracking';
import CurrentUserService from 'datafruits13/services/current-user';
import ChatService from 'datafruits13/services/chat';
import Gif from 'datafruits13/models/gif';
import { next } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { createEmojiAutocomplete } from 'datafruits13/utils/emoji-autocomplete';
import emojiStrategy from '../../emojiStrategy';

interface ChatInputMessageSignature {
  Args: {
    isOffline: unknown;
  };
}

export default class ChatInputMessage extends Component<ChatInputMessageSignature> {
  @service declare chat: ChatService;

  @service declare currentUser: CurrentUserService;

  @service declare session: any;

  @tracked inputMessage: string = '';
  
  @tracked showingGiftSubscriptionModal: boolean = false;

  get hasMessage () {
    return this.inputMessage.length > 0;
  }

  async getBase64Data(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (err: ProgressEvent) => {
        reject(err); // eslint-disable-line
      };
      reader.readAsDataURL(blob);
    });
  }

  @action
  onPasteInput(event: ClipboardEvent) {
    if (!event.clipboardData?.files.length) return;

    event.preventDefault();

    for (const file of event.clipboardData.files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (onLoadEvent) => {
          if (onLoadEvent.target?.result) {
            this.inputMessage = onLoadEvent.target.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  @action
  sendEmoji(shortcode: string) {
    if (this.inputMessage.length === 0) {
      this.inputMessage = shortcode;
    } else {
      this.inputMessage = `${this.inputMessage} ${shortcode}`;
    }
    this.setFocus();
  }

  @action
  sendGif(gif: Gif) {
    this.inputMessage = gif.url;
    this.setFocus();
  }

  setFocus(){
    next(this, ()=> {
      const button: HTMLButtonElement | null = document.querySelector('#send-message-button');
      if (button) {
        button.focus();
      }
    });
  }


  @action
  sendMessage(e: Event) {
    e.preventDefault();
    const message = this.inputMessage;
    if (!isEmpty(message)) {
      // TODO push emoji count here ??
      if (this.chat.token) {
        const role = this.currentUser.user.role;
        const avatarUrl = this.currentUser.user.avatarUrl;
        const style = this.currentUser.user.style;
        const pronouns = this.currentUser.user.pronouns;
        this.chat.push('new:msg_with_token', {
          user: this.chat.username,
          body: message,
          timestamp: Date.now(),
          token: this.chat.token,
          role,
          style,
          pronouns,
          avatarUrl,
          emojiCounts: this._parseEmojiCountFromMessage(message),
        });
      } else {
        this.chat.push('new:msg', { user: this.chat.username, body: message, timestamp: Date.now() });
      }
      this.inputMessage = '';
    }
  }

  _parseEmojiCountFromMessage(message: string): Record<string, number> {
    const counts: Record<string, number> = {};
    const regex = /:([^:\s]+):/g;

    for (const match of message.matchAll(regex)) {
      const emoji = match[1]; // without colons
      // check its actually an emoji via emoji strategy
      if(Object.prototype.hasOwnProperty.call(emojiStrategy, `:${emoji}:`)) {
        counts[emoji] = (counts[emoji] || 0) + 1;
      }
    }

    return counts;
  }

  @action
  toggleGiftSubscriptionModal() {
    this.showingGiftSubscriptionModal = !this.showingGiftSubscriptionModal;
  }

  @action
  didInsert() {
    const emojiComplete = createEmojiAutocomplete();
    const usernameComplete = {
      id: 'usernames',
      match: /\B@([-+\w]*)$/,
      search: (term: string, callback: (results: any) => void) => {
        const matches = Object.keys(this.chat.presences).filter((word) => {
          return word.indexOf(term) === 0 && word !== this.chat.username;
        });
        callback(matches);
      },
      template: function(username: string) {
        return `@${username}`;
      },
      replace: function (username: string) {
        return `@${username} `;
      },
    };
    const input: unknown = document.querySelector('#input-message');
    if (input) {
      const editor = new TextareaEditor(input as HTMLTextAreaElement);
      new Textcomplete(editor, [emojiComplete, usernameComplete], {
        dropdown: {
          maxCount: 10,
          placement: 'top',
        },
      });
    }
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ChatInputMessage: typeof ChatInputMessage;
  }
}

