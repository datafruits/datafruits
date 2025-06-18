import Service, { inject as service } from '@ember/service';
import { later, run } from '@ember/runloop';
import ENV from 'datafruits13/config/environment';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';
import videojs from 'video.js';
import type EventBusService from 'datafruits13/services/event-bus';

enum PlayerState {
  Playing = 'playing',
  Paused = 'paused'
}

enum Mode {
  BG = "bg",
  TV = "tv"
}

export default class VideoStreamService extends Service {
  @service
  declare rollbar: any;

  @service
  declare eventBus: EventBusService;

  @tracked displaying: boolean = true;

  @tracked mode: Mode = Mode.BG;

  @tracked active: boolean = false;

  @tracked useVideoAudio: boolean = false;

  streamName: string = "";
  streamHost: string = "";
  extension: string = "";
  path: string = "";

  player: videojs.Player | null = null;

  playerState: PlayerState = PlayerState.Paused;

  constructor() {
    super(...arguments);
    this.streamHost = ENV.STREAM_HOST;
    this.streamName = ENV.STREAM_NAME;
  }

  async initializePlayer() {
    const name = this.streamName;
    const extension = this.extension;
    const path = this.path;
    run(() => {
      let type;
      const host = this.streamHost;
      const streamUrl = `${host}/${path}/${name}.${extension}`;
      if (extension == 'mp4') {
        type = 'video/mp4';
      } else if (extension == 'm3u8') {
        type = 'application/x-mpegURL';
      } else {
        console.log('Unknown extension: ' + extension);  
        this.active = false;
        return;
      }

      const preview = name;

      const player = videojs('video-player', {
        poster: `previews/${preview}.png`,
        controls: false,
      });

      this.player = player;

      console.log(streamUrl);  
      player.src({
        src: streamUrl,
        type: type,
      });

      player.userActive(false);

      player.tech().on('retryplaylist', this.errorHandler.bind(this));

      const promise = player.play();

      if (promise !== undefined) {
        promise.then(() => {
          console.log('video autoplayed');  
          if (this.useVideoAudio) {
            this.eventBus.publish('liveVideoAudio');
          }
          player.userActive(false);
          this.playerState = PlayerState.Playing;
        })
        .catch((error: Error) => {
          // Autoplay was prevented.
          console.log(`video autoplay failed: ${error}`);  
          player.userActive(false);
          this.rollbar.error(`video autoplay failed: ${error}`);
        });
      }
    });
  }

  errorHandler(event: any) {
    const player = this.player as videojs.Player;
    console.log('in errorHandler');
    console.log(event);
    this.active = false;
    player.dispose();
    this.player = null;
    this.useVideoAudio = false;
    this.eventBus.publish('liveVideoAudioOff');
    later(() => {
      this.fetchStream();
    }, 1000);
  }

  pause() {
    const player = this.player as videojs.Player;
    player.pause();
    this.playerState = PlayerState.Paused;
  }

  play() {
    const player = this.player as videojs.Player;
    if (player) {
      const promise = player.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            console.log('video played');  
            if (this.useVideoAudio) {
              this.eventBus.publish('liveVideoAudio');
            }
            player.userActive(false);
          })
          .catch((error: any) => {
            // Autoplay was prevented.
            console.log(`video play failed: ${error}`);  
            player.userActive(false);
            this.rollbar.error(`video autoplay failed: ${error}`);
          });
      }
    } else {
      console.log('video player not initialized yet!');  
    }
  }

  unmute() {
    const player = this.player as videojs.Player;
    player.muted(false);
  }

  mute() {
    const player = this.player as videojs.Player;
    player.muted(true);
  }

  setVolume(vol: number) {
    const player = this.player as videojs.Player;
    player.volume(vol);
  }

  streamIsActive(name: string, extension: string, path: string) {
    this.active = true;
    this.streamName = name;
    this.extension = extension;
    this.path = path;
    if (path === 'live') {
      this.useVideoAudio = true;
    }
  }

  toggleDisplay() {
    this.displaying = !this.displaying;
    if(this.playerState === PlayerState.Playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  toggleMode() {
    if (this.mode == Mode.BG) {
      this.mode = Mode.TV;
    } else {
      this.mode = Mode.BG;
    }
  }

  fetchStream() {
    const name = this.streamName;
    const host = this.streamHost;
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
                console.log('No stream found');  
                later(() => {
                  this.fetchStream();
                }, 15000);
              }
            })
            .catch(function (err) {
              console.log('Error: ' + err);  
            });
        }
      })
      .catch(function (err) {
        console.log('Error: ' + err);  
      });
  }
}
