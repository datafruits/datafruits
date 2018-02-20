import Component from '@ember/component';

export default Component.extend({
  tagName: "ul",
  elementId: "messages",
  actions: {
    setupAutoscroll(){
      if(this.scrolledToBottom()){
        this.set('willAutoscroll', true);
      }else{
        this.sendAction("newMessagesAvailable");
        this.set('willAutoscroll', false);
      }
    },
    adjustScrolling(){
      if(this.get('willAutoscroll')){
        Ember.$('#messages')[0].scrollTop = Ember.$('#messages')[0].scrollHeight;
      }
    }
  },
  scrolledToBottom() {
    return Ember.$('#messages')[0].scrollHeight - Ember.$('#messages')[0].scrollTop - Ember.$('#messages').outerHeight() < 1;
  },
});
