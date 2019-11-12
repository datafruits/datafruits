import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { debounce } from '@ember/runloop';

@classic
@tagName("ul")
export default class ChatMessages extends Component {
  elementId = "messages";

  touchMove() {
    this.onScroll();
  }

  scroll() {
    this.onScroll();
  }

  @action
  setupAutoscroll() {
    if(this.scrolledToBottom()){
      this.set('willAutoscroll', true);
    }else{
      this.newMessagesAvailable();
      this.set('willAutoscroll', false);
    }
  }

  @action
  adjustScrolling() {
    if(this.willAutoscroll){
      const messages = document.getElementById('messages');
      //$('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
      messages.scrollTop = messages.scrollHeight;
    }
  }

  scrolledToBottom() {
    const messages = document.getElementById('messages');
    const messagesHeight = messages.getBoundingClientRect().height;
    return messages.scrollHeight - messages.scrollTop - messagesHeight < 1;
  }

  didInsertElement() {
    this.element.addEventListener("scroll", () => {
      debounce(this, () => {
        this.onScroll();
      }, 500);
    });
  }
}
