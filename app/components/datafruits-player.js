import classic from 'ember-classic-decorator';
import { classNameBindings } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

@classic
@classNameBindings('playingPodcast', 'isLive', 'playButtonHover:bleed:pink-bg')
export default class DatafruitsPlayer extends Component {
  @service
  eventBus;

  @service
  fastboot;

  @service
  metadata;

  @service
  videoStream;

  playingPodcast = false;
  title = '';
  muted = false;
  showingVolumeControl = false;
  playerState = 'paused'; //"playing", "loading"
  playButtonPressed = false;
  oldVolume = 0.8;
  playTime = 0.0;

  @computed('playerState')
  get paused() {
    return this.playerState === 'paused';
  }

  @computed('playerState')
  get playing() {
    return this.playerState === 'playing';
  }

  @computed('playerState')
  get loading() {
    return this.playerState === 'loading';
  }

  init() {
    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');
    this.eventBus.subscribe('metadataUpdate', this, 'setRadioTitle');
    if (!this.fastboot.isFastBoot) {
      this.set('volume', localStorage.getItem('datafruits-volume') || 0.8);
    }
    super.init(...arguments);
  }

  @computed('title')
  get isLive() {
    const title = this.title;
    return !isEmpty(title) && title.startsWith('LIVE');
  }

  setRadioTitle() {
    if (this.playingPodcast === false) {
      this.set('title', this.metadata.title);
    }
  }

  onTrackPlayed(track) {
    this.set('error', null);
    this.set('title', track.title);
    this.set('playingPodcast', true);
    this.set('playTime', 0.0);

    let audioTag = document.getElementById('radio-player');
    audioTag.src = track.cdnUrl;
    audioTag.play();
  }

  @action
  playButtonMouseEnter() {
    this.set('playButtonHover', true);
  }

  @action
  playButtonMouseOut() {
    this.set('playButtonHover', false);
  }

  @action
  playLiveStream() {
    this.set('playingPodcast', false);
    this.setRadioTitle();
  }

  @action
  play() {
    //let audioTag = document.getElementById('radio-player');
    // if (this.playingPodcast === false) {
    //   // reload stream
    //   audioTag.src = 'https://streampusher-relay.club/datafruits.mp3';
    // }
    // if (audioTag.readyState === 0) {
    //   this.set('playerState', 'loading');
    // }
    // audioTag.play();
    // this.set('playButtonHover', false);
    // this.set('playButtonPressed', true);

    // play video for mobile
    this.videoStream.play();
  }

  @action
  pause() {
    // let audioTag = document.getElementById('radio-player');
    // audioTag.pause();
    // this.set('playButtonPressed', false);
    // this.set('playerState', 'paused');
    this.videoStream.pause();
  }

  @action
  mute() {
    //let audioTag = document.getElementById('radio-player');
    //audioTag.muted = true;
    this.videoStream.volume(0.0);
    this.set('muted', true);
    this.set('oldVolume', this.volume);
    this.set('volume', 0.0);
    localStorage.setItem('datafruits-volume', this.volume);
  }

  @action
  unmute() {
    //let audioTag = document.getElementById('radio-player');
    //audioTag.muted = false;
    this.videoStream.volume(this.oldVolume);
    this.set('muted', false);
    this.set('volume', this.oldVolume);
    localStorage.setItem('datafruits-volume', this.volume);
  }

  @action
  toggleVolumeControl() {
    this.toggleProperty('showingVolumeControl');
  }

  @action
  showVolumeControl() {
    this.set('showingVolumeControl', true);
  }

  @action
  hideVolumeControl() {
    debounce(this, this._hideVolumeControl, 2500);
  }

  _hideVolumeControl() {
    this.set('showingVolumeControl', false);
  }

  @action
  volumeChanged(e) {
    this.set('volume', e.target.value);
    localStorage.setItem('datafruits-volume', this.volume);
    // let audioTag = document.getElementById('radio-player');
    // audioTag.volume = this.volume;
    this.videoStream.volume(this.volume);
  }

  @action
  seek(e) {
    let audioTag = document.getElementById('radio-player');
    const time = audioTag.duration * (e.target.value / 100);

    audioTag.currentTime = time;
  }

  didInsertElement() {
    if (!this.fastboot.isFastBoot) {
      let audioTag = document.getElementById('radio-player');
      audioTag.addEventListener('loadstart', () => {
        if (this.playButtonPressed === true) {
          this.set('playerState', 'seeking');
          if (audioTag.readyState === 0) {
            this.set('playerState', 'loading');
          }
        }
        if (document.getElementsByClassName('seek').length) {
          document.getElementsByClassName('seek')[0].classList.add('seeking');
        }
      });
      audioTag.addEventListener('pause', () => {
        this.set('playerState', 'paused');
      });
      audioTag.addEventListener('playing', () => {
        this.set('playerState', 'playing');
      });
      audioTag.addEventListener('timeupdate', () => {
        const value = (100 / audioTag.duration) * audioTag.currentTime;

        this.set('playTime', value);
      });
      audioTag.addEventListener('seeking', () => {
        if (document.getElementsByClassName('seek-bar-wrapper').length) {
          document.getElementsByClassName('seek-bar-wrapper')[0].classList.add('seeking');
        }
      });
      audioTag.addEventListener('canplay', () => {
        if (document.getElementsByClassName('seek-bar-wrapper').length) {
          document.getElementsByClassName('seek-bar-wrapper')[0].classList.remove('seeking');
        }
        if (document.getElementsByClassName('seek').length) {
          document.getElementsByClassName('seek')[0].classList.remove('seeking');
        }
      });
      audioTag.volume = this.volume;
      this.setRadioTitle();
    }
  }
}
