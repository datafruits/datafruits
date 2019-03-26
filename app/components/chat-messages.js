import Component from '@ember/component';

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
        const messages = document.getElementById('messages');
        //$('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
        messages.scrollTop = messages.scrollHeight;
      }
    }
  },
  scrolledToBottom() {
    const messages = document.getElementById('messages');
    const messagesHeight = messages.getBoundingClientRect().height;
    return messages.scrollHeight - messages.scrollTop - messagesHeight < 1;
  },
});
