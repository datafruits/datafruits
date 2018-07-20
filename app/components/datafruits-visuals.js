//import $ from 'jquery';
import Component from '@ember/component';
//import { later } from '@ember/runloop';
import ENV from "datafruits13/config/environment";
import videojs from "npm:video.js";

export default Component.extend({
  classNames: ['visuals'],
  // googleApiKey: ENV.GOOGLE_API_KEY,
  // youtubeChannelId: ENV.YOUTUBE_CHANNEL_ID,

  init() {
    this._super(...arguments);
    this.set('streamHost', ENV.STREAM_HOST);
    this.set('streamName', ENV.STREAM_NAME);
  },

  autoPlay: true,

  videoStreamActive: true,

  isMobile() {
    if( navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ){

      return true;
    } else {
      return false;
    }
  },

  initializePlayer(name, extension) {
    this.set("videoStreamActive", true);
    let type;
    let liveStream = false;
    let host = this.get('streamHost');
    if (extension == "mp4") {
      type = "video/mp4";
      liveStream = false;
    }
    else if (extension == "m3u8") {
      type = "application/x-mpegURL";
      liveStream = true;
    }
    else {
      console.log("Unknown extension: " + extension);
      this.set("videoStreamActive", false);
      return;
    }

    let preview = name;
    if (name.endsWith("_adaptive")) {
      preview = name.substring(0, name.indexOf("_adaptive"));
    }

    let player = videojs('video-player', {
      poster: `previews/${preview}.png`

    });

    player.src({
      src: `${host}/LiveApp/streams/${name}.${extension}`,
      type: type
    });


    if (this.get('autoPlay')) {
      player.play();
    }
  },

  fetchStream(){
    this.set('videoStreamActive', true);

    let name = this.get('streamName');
    let host = this.get('streamHost');
    fetch(`${host}/LiveApp/streams/${name}_adaptive.m3u8`, {method:'HEAD'}).then((response) => {
      if (response.status == 200) {
        //// adaptive m3u8 exists, play it
        console.log("found adaptive m3u8 stream");
        this.get('initializePlayer').call(this, `${name}_adaptive`, "m3u8");
      } else {
        //adaptive m3u8 not exists, try m3u8 exists.
        fetch(`${host}/LiveApp/streams/${name}.m3u8`, {method:'HEAD'}).then((response) => {
          if (response.status == 200) {
            //m3u8 exists, play it
            console.log("found m3u8 stream");
            this.get('initializePlayer').call(this, name, "m3u8");
          } else {
            //no m3u8 exists, try vod file

            fetch(`${host}/LiveApp/streams/${name}.mp4`, {method:'HEAD'}).then((response) => {
              if (response.status == 200) {
                //mp4 exists, play it
                console.log("found mp4 stream");
                this.get('initializePlayer').call(this, name, "mp4");
              } else {
                console.log("No stream found");
                this.set('videoStreamActive', false);
              }
            }).catch(function(err) {
              console.log("Error: " + err);
            });
          }
        }).catch(function(err) {
          console.log("Error: " + err);
        });
      }

    }).catch(function(err) {
      console.log("Error: " + err);
    });
  },

  didInsertElement(){
    this.get('fetchStream').call(this);
  }
});
