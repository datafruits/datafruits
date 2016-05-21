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
  didInsertElement() {
    this._super(...arguments);
    Ember.$('#messages')[0].scrollTop = Ember.$('#messages')[0].scrollHeight;
  }
});
