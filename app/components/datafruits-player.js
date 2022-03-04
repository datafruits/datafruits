import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Component from '@glimmer/component';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

export default class DatafruitsPlayer extends Component {
  @service
  eventBus;

  @service
  fastboot;

  @service
  metadata;

  @service
  videoStream;

  @tracked playingPodcast = false;
  @tracked playButtonHover = false;
  @tracked title = '';
  @tracked muted = false;
  @tracked showingVolumeControl = false;
  @tracked playerState = 'paused'; //"playing", "loading"
  @tracked playButtonPressed = false;
  @tracked oldVolume = 0.8;
  @tracked playTime = 0.0;
  @tracked volume = 1.0;
  @tracked videoAudioOn = false;

  get paused() {
    return this.playerState === 'paused';
  }

  get playing() {
    return this.playerState === 'playing';
  }

  get loading() {
    return this.playerState === 'loading';
  }

  constructor() {
    super(...arguments);
    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');
    this.eventBus.subscribe('metadataUpdate', this, 'setRadioTitle');
    this.eventBus.subscribe('liveVideoAudio', this, 'useVideoAudio');

    if (!this.fastboot.isFastBoot) {
      this.volume = localStorage.getItem('datafruits-volume') || 0.8;
    }
  }

  get isLive() {
    const title = this.title;
    return !isEmpty(title) && title.startsWith('LIVE');
  }

  setPageTitle() {
    if (!this.fastboot.isFastBoot) {
      document.title = `DATAFRUITS.FM - ${this.title}`;
    }
  }

  setRadioTitle() {
    if (this.playingPodcast === false) {
      this.title = this.metadata.title;
    }
    this.setPageTitle();
  }

  onTrackPlayed(track) {
    this.error = null;
    this.title = track.title;
    this.setPageTitle();
    this.playingPodcast = true;
    this.playTime = 0.0;

    let audioTag = document.getElementById('radio-player');
    audioTag.src = track.cdnUrl;
    audioTag.play();
  }

  useVideoAudio() {
    this.error = null;
    this.videoAudioOn = true;
    // what to use for title??????
    //this.title = track.title;
    //this.setPageTitle();

    let audioTag = document.getElementById('radio-player');
    audioTag.mute();
    //unmute video's audio
    this.videoStream.unmute();
  }

  @action
  playButtonMouseEnter() {
    this.playButtonHover = true;
  }

  @action
  playButtonMouseOut() {
    this.playButtonHover = false;
  }

  @action
  playLiveStream() {
    this.playingPodcast = false;
    this.setRadioTitle();
  }

  @action
  play() {
    let audioTag = document.getElementById('radio-player');
    if (this.playingPodcast === false) {
      // reload stream
      audioTag.src = 'https://streampusher-relay.club/datafruits.mp3';
    }
    if (audioTag.readyState === 0) {
      this.playerState = 'loading';
    }
    audioTag.play();
    this.playButtonHover = false;
    this.playButtonPressed = true;

    // play video for mobile
    this.videoStream.play();
  }

  @action
  pause() {
    let audioTag = document.getElementById('radio-player');
    audioTag.pause();
    this.playButtonPressed = false;
    this.playerState = 'paused';
  }

  @action
  mute() {
    let audioTag = document.getElementById('radio-player');
    audioTag.muted = true;
    this.muted = true;
    this.oldVolume = this.volume;
    this.volume = 0.0;
    localStorage.setItem('datafruits-volume', this.volume);
  }

  @action
  unmute() {
    let audioTag = document.getElementById('radio-player');
    audioTag.muted = false;
    this.muted = false;
    this.volume = this.oldVolume;
    localStorage.setItem('datafruits-volume', this.volume);
  }

  @action
  showVolumeControl() {
    this.showingVolumeControl = true;
  }

  @action
  hideVolumeControl() {
    if (this.showingVolumeControl) {
      debounce(this, this._hideVolumeControl, 2500);
    }
  }

  _hideVolumeControl() {
    this.showingVolumeControl = false;
  }

  @action
  volumeChanged(e) {
    this.volume = e.target.value;
    localStorage.setItem('datafruits-volume', this.volume);
    let audioTag = document.getElementById('radio-player');
    audioTag.volume = this.volume;
  }

  @action
  seek(e) {
    let audioTag = document.getElementById('radio-player');
    const time = audioTag.duration * (e.target.value / 100);

    audioTag.currentTime = time;
  }

  @action
  didInsert() {
    if (!this.fastboot.isFastBoot) {
      let audioTag = document.getElementById('radio-player');
      audioTag.addEventListener('loadstart', () => {
        if (this.playButtonPressed === true) {
          this.playerState = 'seeking';
          if (audioTag.readyState === 0) {
            this.playerState = 'loading';
          }
        }
        if (document.getElementsByClassName('seek').length) {
          document.getElementsByClassName('seek')[0].classList.add('seeking');
        }
      });
      audioTag.addEventListener('pause', () => {
        this.playerState = 'paused';
      });
      audioTag.addEventListener('playing', () => {
        this.playerState = 'playing';
      });
      audioTag.addEventListener('timeupdate', () => {
        const value = (100 / audioTag.duration) * audioTag.currentTime;

        this.playTime = value;
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
