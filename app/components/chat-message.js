import Component from '@ember/component';

export default Component.extend({
  gifsEnabled: true,
  imgRegex: /https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpg|gif|png)/,
  hasImage: Ember.computed('message.body', function(){
    return this.imgRegex.test(this.message.body);
  }),
  imgUrl: Ember.computed('message.body', function(){
    return this.message.body.match(this.imgRegex)[0];
  }),
  willRender() {
    this.sendAction("setupAutoscroll");
  },
  didInsertElement() {
    this._super(...arguments);
    if(this.$("img").length > 0){
      this.$("img")[0].onload = () => {
        this.sendAction("adjustScrolling");
      };
    }else{
      this.sendAction("adjustScrolling");
    }
  }
});
