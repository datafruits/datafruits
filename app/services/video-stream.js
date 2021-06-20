import classic from 'ember-classic-decorator';
import Service from '@ember/service';
import { later, run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'datafruits13/config/environment';
import fetch from 'fetch';

@classic
export default class VideoStreamService extends Service {
  @service
  rollbar;

  init() {
    super.init(...arguments);
    this.set('streamHost', ENV.STREAM_HOST);
    this.set('streamName', ENV.STREAM_NAME);
  }

  active = false;

  async initializePlayer() {
    const module = await import('video.js');
    const videojs = module.default;
    let name = this.streamName;
    let extension = this.extension;
    run(() => {
      let type;
      let host = this.streamHost;
      let streamUrl = `${host}/hls/${name}.${extension}`;
      if (extension == 'mp4') {
        type = 'video/mp4';
      } else if (extension == 'm3u8') {
        type = 'application/x-mpegURL';
      } else {
        console.log('Unknown extension: ' + extension); // eslint-disable-line no-console
        this.set('active', false);
        return;
      }

      let preview = name;

      let player = videojs('video-player', {
        poster: `previews/${preview}.png`,
        userActive: false,
        controls: false,
      });

      this.set('player', player);

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

  errorHandler(/*event*/) {
    this.set('active', false);
    this.player.dispose();
    this.set('player', null);
  }

  play() {
    let player = this.player;
    let promise = player.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          console.log('video played'); // eslint-disable-line no-console
          player.userActive(false);
        })
        .catch((error) => {
          // Autoplay was prevented.
          console.log(`video play failed: ${error}`); // eslint-disable-line no-console
          player.userActive(false);
          this.rollbar.error(`video autoplay failed: ${error}`);
        });
    }
  }

  streamIsActive(name, extension) {
    this.set('active', true);
    this.set('streamName', name);
    this.set('extension', extension);
  }

  fetchStream() {
    let name = this.streamName;
    let host = this.streamHost;
    fetch(`${host}/hls/${name}.m3u8`, { method: 'HEAD' })
      .then((response) => {
        if (response.status == 200) {
          this.streamIsActive(`${name}`, 'm3u8');
        } else {
          //no m3u8 exists, try vod file

          fetch(`${host}/hls/${name}.mp4`, { method: 'HEAD' })
            .then((response) => {
              if (response.status == 200) {
                //mp4 exists, play it
                this.streamIsActive(name, 'mp4');
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
