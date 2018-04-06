/* global $, gapi */
//import $ from 'jquery';
import Component from '@ember/component';
//import { later } from '@ember/runloop';
import ENV from "datafruits13/config/environment";

export default Component.extend({
  classNames: ['visuals'],
  // googleApiKey: ENV.GOOGLE_API_KEY,
  // youtubeChannelId: ENV.YOUTUBE_CHANNEL_ID,
  streamHost: ENV.STREAM_HOST,
  streamName: ENV.STREAM_NAME,

  autoplay: false,

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
    let type;
    let liveStream = false;
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
      src: `streams/${name}.${extension}`,
      type: type
    });


    if (this.get('autoPlay')) {

      player.play();

    }

  },

  //ask if adaptive m3u8 file
  //
  didInsertElement(){
    if(!this.isMobile()){
      this.set('autoPlay', true);
    }
    let name = this.get('streamName');
    let host = this.get('streamHost');
    fetch(`${host}/streams/${name}_adaptive.m3u8`, {method:'HEAD'}).then(function(response) {
      if (response.status == 200) {
        //// adaptive m3u8 existslay it
        this.initializePlayer(`${name}_adaptive`, "m3u8");
      } else {
        //adaptive m3u8 not exists, try m3u8 exists.
        fetch(`${host}/streams/${name}.m3u8`, {method:'HEAD'}).then(function(response) {
          if (response.status == 200) {
            //m3u8 exists, play it
            this.initializePlayer(name, "m3u8");
          } else {
            //no m3u8 exists, try vod file

            fetch(`${host}/streams/${name}.mp4`, {method:'HEAD'}).then(function(response) {
              if (response.status == 200) {
                //mp4 exists, play it
                this.initializePlayer(name, "mp4");
              } else {
                    console.log("No stream found");
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
  }
});
