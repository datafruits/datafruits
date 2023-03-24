import Service, { inject as service } from '@ember/service';
import { later, run } from '@ember/runloop';
import ENV from 'datafruits13/config/environment';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';

export default class VideoStreamService extends Service {
  @service
  rollbar;

  @tracked
  mode = "bg";

  @service
  eventBus;

  @tracked 
  active = false;
  
  @tracked
  useVideoAudio = false;

  constructor() {
    super(...arguments);
    this.streamHost = ENV.STREAM_HOST;
    this.streamName = ENV.STREAM_NAME;
  }

  async initializePlayer() {
    const module = await import('video.js');
    const videojs = module.default;
    let name = this.streamName;
    let extension = this.extension;
    let path = this.path;
    run(() => {
      let type;
      let host = this.streamHost;
      let streamUrl = `${host}/${path}/${name}.${extension}`;
      if (extension == 'mp4') {
        type = 'video/mp4';
      } else if (extension == 'm3u8') {
        type = 'application/x-mpegURL';
      } else {
        console.log('Unknown extension: ' + extension); // eslint-disable-line no-console
        this.active = false;
        return;
      }

      let preview = name;

      let player = videojs('video-player', {
        poster: `previews/${preview}.png`,
        userActive: false,
        controls: false,
      });

      this.player = player;

      console.log(streamUrl); // eslint-disable-line no-console
      player.src({
        src: streamUrl,
        type: type,
      });

      player.userActive(false);

      player.tech().on('retryplaylist', this.errorHandler.bind(this));

      let promise = player.play();

      if (promise !== undefined) {
        promise
          .then(() => {
            console.log('video autoplayed'); // eslint-disable-line no-console
            if (this.useVideoAudio) {
              this.eventBus.publish('liveVideoAudio');
            }
            player.userActive(false);
          })
          .catch((error) => {
            // Autoplay was prevented.
            console.log(`video autoplay failed: ${error}`); // eslint-disable-line no-console
            player.userActive(false);
            this.rollbar.error(`video autoplay failed: ${error}`);
          });
      }
    });
  }

  errorHandler(event) {
    console.log('in errorHandler');
    console.log(event);
    this.active = false;
    this.player.dispose();
    this.player = null;
    this.useVideoAudio = false;
    this.eventBus.publish('liveVideoAudioOff');
    later(() => {
      this.fetchStream();
    }, 1000);
  }

  play() {
    let player = this.player;
    if (player) {
      let promise = player.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            console.log('video played'); // eslint-disable-line no-console
            if (this.useVideoAudio) {
              this.eventBus.publish('liveVideoAudio');
            }
            player.userActive(false);
          })
          .catch((error) => {
            // Autoplay was prevented.
            console.log(`video play failed: ${error}`); // eslint-disable-line no-console
            player.userActive(false);
            this.rollbar.error(`video autoplay failed: ${error}`);
          });
      }
    } else {
      console.log('video player not initialized yet!'); // eslint-disable-line no-console
    }
  }

  unmute() {
    this.player.muted(false);
  }

  mute() {
    this.player.muted(true);
  }

  setVolume(vol) {
    this.player.volume(vol);
  }

  streamIsActive(name, extension, path) {
    this.active = true;
    this.streamName = name;
    this.extension = extension;
    this.path = path;
    if (path === 'live') {
      this.useVideoAudio = true;
    }
  }

  toggleMode() {
    if (this.mode == 'bg') {
      this.mode = 'tv';
    } else {
      this.mode = "bg";
    }
    console.log(this.mode)
  }

  fetchStream() {
    let name = this.streamName;
    let host = this.streamHost;
    fetch(`${host}/hls/${name}.m3u8`, { method: 'HEAD' })
      .then((response) => {
        if (response.status == 200) {
          this.streamIsActive(`${name}`, 'm3u8', 'hls');
        } else {
          //
          // fetch /live here
          console.log('hls not found, trying to fetch /live');
          fetch(`${host}/live/${name}.m3u8`, { method: 'HEAD' })
            .then((response) => {
              if (response.status == 200) {
                //mp4 exists, play it
                this.streamIsActive(name, 'm3u8', 'live');
              } else {
                if (ENV.environment === 'test') return;
                console.log('No stream found'); // eslint-disable-line no-console
                later(() => {
                  this.fetchStream();
                }, 15000);
              }
            })
            .catch(function (err) {
              console.log('Error: ' + err); // eslint-disable-line no-console
            });
        }
      })
      .catch(function (err) {
        console.log('Error: ' + err); // eslint-disable-line no-console
      });
  }
}
