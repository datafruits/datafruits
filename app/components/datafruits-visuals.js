import Ember from 'ember';

export default Ember.Component.extend({
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
