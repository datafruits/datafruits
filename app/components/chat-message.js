import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  gifsEnabled: true,
  imgRegex: /https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpg|gif|png)/,
  hasImage: computed('message.body', function(){
    return this.imgRegex.test(this.message.body);
  }),
  imgUrl: computed('message.body', function(){
    return this.message.body.match(this.imgRegex)[0];
  }),
  willRender() {
    this.get("setupAutoscroll")();
  },
  didInsertElement() {
    this._super(...arguments);
    if(this.$("img").length > 0){
      this.$("img")[0].onload = () => {
        this.get("adjustScrolling")();
      };
    }else{
      this.get("adjustScrolling")();
    }
  }
});
