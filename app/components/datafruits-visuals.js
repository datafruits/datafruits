import Ember from 'ember';

export default Ember.Component.extend({
  playerVars: {
    autoplay: 0,
    controls: 0,
    enablejsapi: 1,
    rel: 0, // disable related videos
    showinfo: 0,
    autohide: 1,
    fs: 0, // disable fullscreen button
    playsinline: 1,
    disablekb: 1,
    // iv_load_policy: 3,
    // modestbranding: 1,
  },

  classNames: ['visuals'],
  pollVjApi: function(){
    var _this = this;
    Ember.run.later(function() {
      _this.setVisuals();
      _this.pollVjApi();
    }, 10000);
  },
  setVisuals: function(vj_enabled){
    var url = "http://datafruits.streampusher.com/vj/enabled.json";
    Ember.$.get(url, function(data){
      var vj_enabled = data.vj_enabled;
      if(vj_enabled == true){
        $(".visuals").show();
      }else{
        $(".visuals").hide();
      }
    });
  },
  setup: function(){
    this.setVisuals();
    this.pollVjApi();
  }.on('didInsertElement')
});
