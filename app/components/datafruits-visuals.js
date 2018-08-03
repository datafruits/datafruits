//import $ from 'jquery';
import Component from '@ember/component';
import { later, run } from '@ember/runloop';
import ENV from "datafruits13/config/environment";
import videojs from "npm:video.js";

export default Component.extend({
  classNames: ['visuals'],

  init() {
    this._super(...arguments);
    this.set('streamHost', ENV.STREAM_HOST);
    this.set('streamName', ENV.STREAM_NAME);
  },

  autoplay: true,

  videoStreamActive: false,
  videoActivated: false,

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

  initializePlayer() {
    let name = this.get('streamName');
    let extension = this.get('extension');
    run(() => {
      let type;
      let host = this.get('streamHost');
      let streamUrl = `${host}/LiveApp/streams/${name}.${extension}`;
      if (extension == "mp4") {
        type = "video/mp4";
      }
      else if (extension == "m3u8") {
        type = "application/x-mpegURL";
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

      console.log(streamUrl);
      player.src({
        src: streamUrl,
        type: type
      });


      if (this.get('autoPlay')) {

        player.play();

      }
      this.set('videoActivated', true);
    });

  },

  streamIsActive(name, extension){
    this.set("videoStreamActive", true);
    this.set('streamName', name);
    this.set('extension', extension);
  },

  fetchStream(){
    let name = this.get('streamName');
    let host = this.get('streamHost');
    fetch(`${host}/LiveApp/streams/${name}_adaptive.m3u8`, {method:'HEAD'}).then((response) => {
      if (response.status == 200) {
        //// adaptive m3u8 existslay it
        this.streamIsActive(`${name}_adaptive`, "m3u8");
      } else {
        //adaptive m3u8 not exists, try m3u8 exists.
        fetch(`${host}/LiveApp/streams/${name}.m3u8`, {method:'HEAD'}).then((response) => {
          if (response.status == 200) {
            //m3u8 exists, play it
            this.streamIsActive(name, "m3u8");
          } else {
            //no m3u8 exists, try vod file

            fetch(`${host}/LiveApp/streams/${name}.mp4`, {method:'HEAD'}).then((response) => {
              if (response.status == 200) {
                //mp4 exists, play it
                this.streamIsActive(name, "mp4");
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
  },

  didRender(){
    if(this.get("videoStreamActive")){
      this.initializePlayer();
    }else {
      later(()=> {
        this.fetchStream();
      }, 5000);
    }
  },

  //ask if adaptive m3u8 file
  //
  didInsertElement(){
    if(!this.isMobile()){
      this.set('autoPlay', true);
    }
    this.fetchStream();
  }
});
