import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  tagName: "ul",
  elementId: "messages",
  actions: {
    setupAutoscroll(){
      if(this.scrolledToBottom()){
        this.set('willAutoscroll', true);
      }else{
        this.newMessagesAvailable();
        this.set('willAutoscroll', false);
      }
    },
    adjustScrolling(){
      if(this.willAutoscroll){
        $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
      }
    }
  },
  scrolledToBottom() {
    return $('#messages')[0].scrollHeight - $('#messages')[0].scrollTop - $('#messages').outerHeight() < 1;
  },
});
