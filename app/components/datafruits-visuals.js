/* global $, gapi */
import $ from 'jquery';
import Component from '@ember/component';
import { later } from '@ember/runloop';
import ENV from "datafruits13/config/environment";

export default Component.extend({
  // googleApiKey: "AIzaSyA2tCCcRl5itJoSLRL-COoHXwpyMAX9raQ",
  // youtubeChannelId: "UChjo2k-w5UhvroZU0xqVcsg",
  googleApiKey: ENV.GOOGLE_API_KEY,
  youtubeChannelId: ENV.YOUTUBE_CHANNEL_ID,
  ytid: "",
  playerVars: {
    autoplay: 1,
    mute: 1,
    volume: 0,
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
    later(function() {
      _this.setVisuals();
      _this.pollVjApi();
    }, 10000);
  },
  setVisuals: function(){
    var url = "https://datafruits.streampusher.com/vj/enabled.json";
    $.get(url, function(data){
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
  didInsertElement(){
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
  }
});
