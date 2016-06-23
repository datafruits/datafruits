import Ember from 'ember';

export default Ember.Component.extend({
  gifsEnabled: true,
  imgRegex: /https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpg|gif|png)/,
  hasImage: Ember.computed('message.body', function(){
    return this.imgRegex.test(this.message.body);
  }),
  imgUrl: Ember.computed('message.body', function(){
    return this.message.body.match(this.imgRegex)[0];
  }),
  scrolledToBottom: function() {
    let scrollPosition = Ember.$('#messages')[0].scrollHeight - Ember.$('#messages')[0].scrollTop;
    return scrollPosition === Ember.$('#messages').outerHeight();
  },
  willRender() {
    if(this.scrolledToBottom()){
      this.willAutoscroll = true;
    }else{
      this.sendAction("newMessagesAvailable");
      this.willAutoscroll = false;
    }
  },
  didInsertElement() {
    this._super(...arguments);
    if(this.willAutoscroll){
      Ember.$('#messages')[0].scrollTop = Ember.$('#messages')[0].scrollHeight;
    }
  }
});
