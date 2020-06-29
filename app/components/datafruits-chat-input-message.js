import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import emojiStrategy from "../emojiStrategy";
import Component from '@ember/component';
import { Textcomplete, Textarea } from 'textcomplete';

@classic
@tagName("span")
export default class DatafruitsChatInputMessage extends Component {
  @service
  chat;

  @oneWay('chat.username')
  username;

  @oneWay('chat.joinedUsers')
  joinedUsers;

  @action
  closeGifSearch() {
    this.set('showingGifSearch', false);
  }


  @action
  updateBigGifPreview(gif){

    this.set('focusedGif', gif.url);
    //this.set('shouldShowBigPreview', abc);
  }

  @action
  sendGif(gif) {
    this.set('inputMessage', gif.url);
    this.set('showingGifSearch', false);
    this.element.querySelector("#send-message-button").focus();
  }

  @action
  showGifSearch() {
    this.set('showingGifSearch', true);
  }

  @action
  sendMessage() {
    const message = this.inputMessage;
    if(message){
      this.chat.push("new:msg", { user: this.username, body: message, timestamp: Date.now() });
      this.set('inputMessage', '');
    }
  }

  didInsertElement() {
    let emojiComplete = {
      id: "emojis",
      //match: /\B:([\-+\w]*)$/,
      match: /(^|\s):([a-z0-9+\-_]*)$/,

      search: function (term, callback) {
        var results = [];
        var results2 = [];
        var results3 = [];
        for(let [shortname, data] of Object.entries(emojiStrategy)) {
          if(shortname.indexOf(term) > -1) { results.push(shortname); }
          else {
            if((data.aliases !== null) && (data.aliases.indexOf(term) > -1)) {
              results2.push(shortname);
            }
            else if((data.keywords !== null) && (data.keywords.indexOf(term) > -1)) {
              results3.push(shortname);
            }
          }
        }
        if(term.length >= 3) {
          results.sort(function(a,b) { return (a.length > b.length); });
          results2.sort(function(a,b) { return (a.length > b.length); });
          results3.sort();
        }
        var newResults = results.concat(results2).concat(results3);

        callback(newResults);
      },
      template: function (shortname) {
        if(emojiStrategy[shortname].custom){
          return '<img class="emojione" src="/assets/images/emojis/'+emojiStrategy[shortname].unicode+'.png"> '+shortname;
        }else{
          return '<img class="emojione" src="//cdn.jsdelivr.net/emojione/assets/4.0/png/32/'+emojiStrategy[shortname].unicode+'.png"> '+shortname;
        }
      },
      replace: function (shortname) {
        return shortname;
      },
    };
    let usernameComplete = {
      id: "usernames",
      match: /(^|\s)(\w{2,})$/,
      search: (term, callback) => {
        let matches;
        matches = this.joinedUsers.filter((word) => {
          return (word.indexOf(term) === 0) && (word !== this.username);
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
        placement: 'top'
      }
    });
    emojiTextcomplete.register([emojiComplete, usernameComplete]);
  }
}
