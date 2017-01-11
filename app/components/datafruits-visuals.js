/* global $, gapi */
import Ember from 'ember';

export default Ember.Component.extend({
  googleApiKey: "AIzaSyA2tCCcRl5itJoSLRL-COoHXwpyMAX9raQ",
  youtubeChannelId: "UC0BIvrx3RUfkUadPa8_A_6A",
  ytid: "",
  playerVars: {
    autoplay: 1,
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
  pollYoutubeApi: function(){
  },
  pollVjApi: function(){
    var _this = this;
    Ember.run.later(function() {
      _this.setVisuals();
      _this.pollVjApi();
    }, 10000);
  },
  setVisuals: function(){
    var url = "http://datafruits.streampusher.com/vj/enabled.json";
    Ember.$.get(url, function(data){
      var vj_enabled = data.vj_enabled;
      if(vj_enabled === true){
        $(".visuals").show();
      }else{
        $(".visuals").hide();
      }
    });
  },
  searchYoutube: function(){
    var channelId = this.youtubeChannelId;
    var request = gapi.client.youtube.search.list({
      part: 'snippet',
      channelId: channelId,
      maxResults: 1,
      type: 'video',
      eventType: 'live'

    });

    request.then((response) => {
      if(response.result.pageInfo.totalResults === 0){
        console.log("no live stream at the moment");
      }else{
        var videoId = response.result.items[0].id.videoId;
        console.log("live stream: "+videoId);
        this.set("ytid", videoId);
      }
    }, function(reason) {
      console.log('Error: ' + reason.result.error.message);
    });

  },
  setup: function(){
    this.setVisuals();
    this.pollVjApi();
    $.getScript("https://apis.google.com/js/client.js", () => {
      // Keep checking until the library is loaded
      var googleApiKey = this.googleApiKey;
      var searchYoutube = this.searchYoutube.bind(this);
      (function checkIfLoaded() {
        if (gapi.client){
          gapi.client.setApiKey(googleApiKey);
          gapi.client.load('youtube', 'v3').then(searchYoutube);
        }else{
          window.setTimeout(checkIfLoaded, 10);
        }
      })();
    });
  }.on('didInsertElement')
});
