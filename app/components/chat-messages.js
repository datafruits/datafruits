import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "ul",
  elementId: "messages",
  actions: {
    setupAutoscroll(){
      if(this.scrolledToBottom()){
        this.willAutoscroll = true;
      }else{
        this.sendAction("newMessagesAvailable");
        this.willAutoscroll = false;
      }
    },
    adjustScrolling(){
      if(this.willAutoscroll){
        Ember.$('#messages')[0].scrollTop = Ember.$('#messages')[0].scrollHeight;
      }
    }
  },
  scrolledToBottom() {
    return Ember.$('#messages')[0].scrollHeight - Ember.$('#messages')[0].scrollTop - Ember.$('#messages').outerHeight() < 1;
  },
});
