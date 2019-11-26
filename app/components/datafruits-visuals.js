import Component from '@ember/component';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import ENV from "datafruits13/config/environment";
import fetch from 'fetch';

export default Component.extend({
  classNames: ['visuals'],
  socket: service(),

  init() {
    this._super(...arguments);
    this.set('streamHost', ENV.STREAM_HOST);
    this.set('streamName', ENV.STREAM_NAME);

    let socket = this.socket.socket;

    let vjChannel = socket.channel("vj", {});

    vjChannel.join().receive("ignore", function () {
      return console.log("auth error"); // eslint-disable-line no-console
    }).receive("ok", function () {
      return console.log("vj join ok"); // eslint-disable-line no-console
    }).receive("timeout", function () {
      return console.log("Connection interruption"); // eslint-disable-line no-console
    });

    vjChannel.on("vj", (vj) => {
      let enabled = vj.message;
      console.log(`vj channel: ${enabled}`);
      if(enabled === '1'){
        this.set('videoStreamActive', true);
        console.log('performing tasks');
        this.fetchStream.perform();
      }else{
        this.set('videoStreamActive', false);
        console.log('cancelling tasks');
        this.fetchStream.cancelAll();
      }
      //this.set('title', vj.message);
      //this.eventBus.publish("vjUpdate", vj.message);
    });
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

  initializePlayer: async function() {
    const module = await import("video.js");
    const videojs = module.default;
    let name = this.streamName;
    let extension = this.extension;
    run(() => {
      let type;
      let host = this.streamHost;
      let streamUrl = `${host}/hls/${name}.${extension}`;
      if (extension == "mp4") {
        type = "video/mp4";
      }
      else if (extension == "m3u8") {
        type = "application/x-mpegURL";
      }
      else {
        console.log("Unknown extension: " + extension); // eslint-disable-line no-console
        this.set("videoStreamActive", false);
        return;
      }

      let preview = name;

      let player = videojs('video-player', {
        poster: `previews/${preview}.png`

      });

      console.log(streamUrl); // eslint-disable-line no-console
      player.src({
        src: streamUrl,
        type: type
      });


      if (this.autoPlay) {

        player.play();

      }
      this.set('videoActivated', true);
    });

  },

  streamIsActive(name, extension){
    this.set("videoStreamActive", true);
    this.set('streamName', name);
    this.set('extension', extension);
    this.fetchStream.cancelAll();
  },

  fetchStream: task(function* () {
    let name = this.streamName;
    let host = this.streamHost;
    while (true) {
      yield this._checkIfStreamIsActive(name, host);
      yield timeout(15000);
    }
  }).restartable(),

  _checkIfStreamIsActive(name, host){
    fetch(`${host}/hls/${name}.m3u8`, {method:'HEAD'}).then((response) => {
      if (response.status == 200) {
        this.streamIsActive(`${name}`, "m3u8");
      } else {
        //no m3u8 exists, try vod file

        fetch(`${host}/hls/${name}.mp4`, {method:'HEAD'}).then((response) => {
          if (response.status == 200) {
            //mp4 exists, play it
            this.streamIsActive(name, "mp4");
          } else {
            console.log("No stream found"); // eslint-disable-line no-console
          }
        }).catch(function(err) {
          console.log("Error: " + err); // eslint-disable-line no-console
        });
      }

    }).catch(function(err) {
      console.log("Error: " + err); // eslint-disable-line no-console
    });
  },

  didRender(){
    if(!this.get('fastboot.isFastBoot')){
      if(this.videoStreamActive){
        this.initializePlayer();
      }
    }
  },

  didInsertElement(){
    if(!this.isMobile()){
      this.set('autoPlay', true);
    }
  }
});
