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
    return Ember.$('#messages')[0].scrollHeight - Ember.$('#messages')[0].scrollTop - Ember.$('#messages').outerHeight() < 1;
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
      if(this.$("img").length > 0){
        this.$("img")[0].onload = () => {
          Ember.$('#messages')[0].scrollTop = Ember.$('#messages')[0].scrollHeight;
        };
      }else{
        Ember.$('#messages')[0].scrollTop = Ember.$('#messages')[0].scrollHeight;
      }
    }
  }
});
