import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import emojiStrategy from 'datafruits13/emojiStrategy';
import Component from '@glimmer/component';
import { Textcomplete } from '@textcomplete/core';
import { TextareaEditor } from '@textcomplete/textarea';
import { tracked } from '@glimmer/tracking';
import CurrentUserService from 'datafruits13/services/current-user';
import ChatService from 'datafruits13/services/chat';
import Gif from 'datafruits13/models/gif';
import { next } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { on } from "@ember/modifier";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { Input } from "@ember/component";
import t from "ember-intl/helpers/t";
import Icon from "../ui/icon.js";
import EmojiSelector from "./emoji-selector.js";

interface ChatInputMessageSignature {
  Args: {
    isOffline: unknown;
  };
}

export default class ChatInputMessage extends Component<ChatInputMessageSignature> {<template><form {{on "submit" this.sendMessage}}>
  <span class="chat-input" {{didInsert this.didInsert}}>
    <Input @type="text" id="input-message" autocomplete="off" @value={{this.inputMessage}} autofocus="autofocus" placeholder={{t "chat.message_placeholder"}} class="sm:w-1/5 md:w-3/5 lg:w-3/4" aria-label="{{t "chat.label.input"}}" {{on "paste" this.onPasteInput}} data-test-chat-input-message />
    {{#if this.hasMessage}}
      <button {{on "click" this.sendMessage}} type="submit" class="cool-button" id="send-message-button" disabled={{@isOffline}} title={{t "chat.titles.send"}}>
          <Icon @name="arrow-right" />
      </button>
    {{/if}}
    <EmojiSelector @sendGif={{this.sendGif}} @sendEmoji={{this.sendEmoji}} />
  </span>
</form></template>
  @service declare chat: ChatService;

  @service declare currentUser: CurrentUserService;

  @tracked inputMessage: string = '';

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
        });
      } else {
        this.chat.push('new:msg', { user: this.chat.username, body: message, timestamp: Date.now() });
      }
      this.inputMessage = '';
    }
  }

  @action
  didInsert() {
    const emojiComplete = {
      id: 'emojis',
      match: /\B:([-+\w]*)$/,

      context: () => {
        return true;
      },

      search: (term: string, callback: (results: any) => void) => {
        console.log(term);
        const results: string[] = [];
        const results2: string[] = [];
        const results3: string[] = [];
        for (const [shortname, data] of Object.entries(emojiStrategy)) {
          if (shortname.indexOf(term) > -1) {
            results.push(shortname);
          } else {
            if (data.keywords !== null && data.keywords.indexOf(term) > -1) {
              results3.push(shortname);
            }
          }
        }
        if (term.length >= 3) {
          results.sort((a, b) => {
            if(a.length > b.length) {
              return 1;
            }
            if(a.length < b.length) {
              return -1;
            }
            return 0;
          });
          //results.sort();
          results2.sort((a, b) => {
            if(a.length > b.length) {
              return 1;
            }
            if(a.length < b.length) {
              return -1;
            }
            return 0;
          });
          //results2.sort();
          results3.sort();
        }
        const newResults = results.concat(results2).concat(results3);

        callback(newResults);
      },
      template: function (shortname: string) {
        let extension;
        if (emojiStrategy[shortname].animated) {
          extension = '.gif';
        } else {
          extension = '.png';
        }
        if (emojiStrategy[shortname].custom) {
          return `<img class="emojione" src="/assets/images/emojis/${emojiStrategy[shortname].unicode}${extension}"> ${shortname}`;
        } else {
          return (
            '<img class="emojione" src="//cdn.jsdelivr.net/emojione/assets/4.0/png/32/' +
            emojiStrategy[shortname].unicode +
            '.png"> ' +
            shortname
          );
        }
      },
      replace: function (shortname: string) {
        return shortname;
      },
    };
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

