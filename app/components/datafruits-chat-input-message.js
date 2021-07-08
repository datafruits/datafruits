import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import emojiStrategy from '../emojiStrategy';
import Component from '@glimmer/component';
import { Textcomplete, Textarea } from 'textcomplete';
import { tracked } from '@glimmer/tracking';

export default class DatafruitsChatInputMessage extends Component {
  @service
  chat;

  @service
  currentUser;

  @tracked showingGifSearch = false;

  @tracked inputMessage;

  @action
  closeGifSearch() {
    this.showingGifSearch = false;
  }

  @action
  sendGif(gif) {
    this.inputMessage = gif.url;
    this.showingGifSearch = false;
    document.querySelector('#send-message-button').focus();
  }

  @action
  showGifSearch() {
    this.showingGifSearch = true;
  }

  @action
  sendMessage(e) {
    e.preventDefault();
    const message = this.inputMessage;
    if (message) {
      if (this.chat.token) {
        const role = this.currentUser.user.role;
        const avatarUrl = this.currentUser.user.avatarUrl;
        this.chat.push('new:msg_with_token', {
          user: this.chat.username,
          body: message,
          timestamp: Date.now(),
          token: this.chat.token,
          role,
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
    let emojiComplete = {
      id: 'emojis',
      //match: /\B:([\-+\w]*)$/,
      match: /(^|\s):([a-z0-9+\-_]*)$/,

      search: function (term, callback) {
        var results = [];
        var results2 = [];
        var results3 = [];
        for (let [shortname, data] of Object.entries(emojiStrategy)) {
          if (shortname.indexOf(term) > -1) {
            results.push(shortname);
          } else {
            if (data.aliases !== null && data.aliases.indexOf(term) > -1) {
              results2.push(shortname);
            } else if (data.keywords !== null && data.keywords.indexOf(term) > -1) {
              results3.push(shortname);
            }
          }
        }
        if (term.length >= 3) {
          results.sort(function (a, b) {
            return a.length > b.length;
          });
          results2.sort(function (a, b) {
            return a.length > b.length;
          });
          results3.sort();
        }
        var newResults = results.concat(results2).concat(results3);

        callback(newResults);
      },
      template: function (shortname) {
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
      replace: function (shortname) {
        return shortname;
      },
    };
    let usernameComplete = {
      id: 'usernames',
      match: /(^|\s)(\w{2,})$/,
      search: (term, callback) => {
        let matches;
        matches = Object.keys(this.chat.joinedUsers).filter((word) => {
          return word.indexOf(term) === 0 && word !== this.username;
        });
        callback(matches);
      },
      replace: function (word) {
        return word + ' ';
      },
    };
    const editor = new Textarea(document.getElementById('input-message'));
    let emojiTextcomplete = new Textcomplete(editor, {
      dropdown: {
        maxCount: 25,
        placement: 'top',
      },
    });
    emojiTextcomplete.register([emojiComplete, usernameComplete]);
  }
}
