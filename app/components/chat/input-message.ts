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

export default class ChatInputMessage extends Component {
  @service declare chat: ChatService;

  @service declare currentUser: CurrentUserService;

  @tracked inputMessage: string = '';

  @tracked hasMessage = false;
  
  @action
  setMessage() {
    this.hasMessage = this.inputMessage.length > 0;
  }

  @action
  sendEmoji(shortcode: string) {
    if (this.inputMessage.length === 0) {
      this.inputMessage = shortcode;
    } else {
      this.inputMessage = `${this.inputMessage} ${shortcode}`;
    }
    const button: HTMLButtonElement | null = document.querySelector('#send-message-button');
    if (button) {
      button.focus();
      this.setMessage();
    }
  }

  @action
  sendGif(gif: Gif) {
    this.inputMessage = gif.url;
    const button: HTMLButtonElement | null = document.querySelector('#send-message-button');
    if (button) {
      button.focus();
      this.setMessage();
    }
  }

  @action
  sendMessage(e: Event) {
    e.preventDefault();
    const message = this.inputMessage;
    if (message) {
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

      search: async (term: string, callback: (results: any) => void) => {
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
