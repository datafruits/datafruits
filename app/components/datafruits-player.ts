import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Component from '@glimmer/component';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import VideoStreamService from 'datafruits13/services/video-stream';
import type Track from 'datafruits13/models/track';

enum PlayerState {
  Playing = 'playing',
  Loading = 'loading',
  Paused = 'paused',
  Seeking = 'seeking'
}

interface DatafruitsPlayerSignature {
  Args: {};
  Blocks: {
    default: [];
  };
}

export default class DatafruitsPlayer extends Component<DatafruitsPlayerSignature> {
  @service
  declare eventBus: any;

  @service
  declare fastboot: any;

  @service
  declare metadata: any;

  @service
  declare videoStream: VideoStreamService;

  @tracked playingPodcast = false;
  @tracked playButtonHover = false;
  @tracked title = '';
  @tracked muted = false;
  @tracked showingVolumeControl = false;
  @tracked playerState: PlayerState = PlayerState.Paused; //"playing", "loading"
  @tracked playButtonPressed = false;
  @tracked oldVolume = 0.8;
  @tracked playTimePercentage = 0.0;
  @tracked playTime = 0.0;
  @tracked duration = 0.0;
  @tracked volume = 1.0;
  @tracked videoAudioOn = false;

  get paused(): boolean {
    return this.playerState === PlayerState.Paused;
  }

  get playing(): boolean {
    return this.playerState === PlayerState.Playing;
  }

  get loading(): boolean {
    return this.playerState === PlayerState.Loading;
  }

  constructor(owner: unknown, args: DatafruitsPlayerSignature['Args']) {
    super(owner, args);
    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');
    this.eventBus.subscribe('metadataUpdate', this, 'setRadioTitle');
    this.eventBus.subscribe('liveVideoAudio', this, 'useVideoAudio');
    this.eventBus.subscribe('liveVideoAudioOff', this, 'disableVideoAudio');

    if (!this.fastboot.isFastBoot) {
      this.volume = parseFloat(localStorage.getItem('datafruits-volume') as string) || 0.8;
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

  onTrackPlayed(track: Track) {
    //this.error = null;
    this.title = track.title;
    this.setPageTitle();
    this.playingPodcast = true;
    this.playTime = 0.0;
    this.playTimePercentage = 0.0;

    const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
    audioTag.src = track.cdnUrl;
    if (audioTag.readyState === 0) {
      this.playerState = PlayerState.Loading;
    }
    audioTag.play();
  }

  useVideoAudio() {
    //this.error = null;
    this.videoAudioOn = true;

    const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
    audioTag.muted = true;
    this.videoStream.unmute();
  }

  disableVideoAudio() {
    this.videoAudioOn = false;
    const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
    audioTag.muted = false;
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
    const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
    audioTag.pause();
    this.playingPodcast = false;
    this.setRadioTitle();
    audioTag.src = 'https://streampusher-relay.club/datafruits.mp3';
    audioTag.play();
  }

  @action
  play() {
    const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
    if (this.playingPodcast === false) {
      // reload stream
      audioTag.src = 'https://streampusher-relay.club/datafruits.mp3';
    }
    if (audioTag.readyState === 0) {
      this.playerState = PlayerState.Loading;
    }
    audioTag.play();
    this.playButtonHover = false;
    this.playButtonPressed = true;

    // play video for mobile
    this.videoStream.play();
  }

  @action
  pause() {
    if (this.videoAudioOn) {
      this.videoStream.mute();
    } else {
      const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
      audioTag.pause();
    }
    this.playButtonPressed = false;
    this.playerState = PlayerState.Paused;
  }

  @action
  mute() {
    if (this.videoAudioOn) {
      this.videoStream.mute();
    } else {
      const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
      audioTag.muted = true;
    }
    this.muted = true;
    this.oldVolume = this.volume;
    this.volume = 0.0;
    localStorage.setItem('datafruits-volume', this.volume.toString());
  }

  @action
  unmute() {
    if (this.videoAudioOn) {
      this.videoStream.unmute();
    } else {
      const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
      audioTag.muted = false;
    }
    this.muted = false;
    this.volume = this.oldVolume;
    localStorage.setItem('datafruits-volume', this.volume.toString());
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
  volumeChanged(e: any) {
    this.volume = e.target.value;
    localStorage.setItem('datafruits-volume', this.volume.toString());
    if (this.videoAudioOn) {
      this.videoStream.setVolume(this.volume);
    } else {
      const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
      audioTag.volume = this.volume;
    }
  }

  @action
  seek(e: any) {
    const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
    const time = audioTag.duration * (e.target.value / 100);

    audioTag.currentTime = time;
  }

  get formattedPlayTime() {
    if(this.playTime) {
      return `${this._formatTime(this.playTime)} / ${this._formatTime(this.duration)}`;
    } else {
      return "...";
    }
  }

  _formatTime(time: number) {
    const hours = Math.floor(time / (60 * 60));
    const minutes = Math.floor(time / 60) % 60;
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  @action
  didInsert() {
    if (!this.fastboot.isFastBoot) {
      window.addEventListener('keydown', (event) => {
        // IME events
        if (event.isComposing || event.keyCode === 229) {
          return;
        }

        if(
          (event.key == " " ||
          event.code == "Space" ||
          event.keyCode == 32)
         && event.target instanceof HTMLBodyElement) {
          if(this.playerState === 'paused') {
            this.play();
          } else {
            this.pause()
          }
        }

      });

      const audioTag = document.getElementById('radio-player') as HTMLAudioElement;
      audioTag.addEventListener('loadstart', () => {
        if (this.playButtonPressed === true) {
          this.playerState = PlayerState.Seeking;
          if (audioTag.readyState === 0) {
            this.playerState = PlayerState.Loading;
          }
        }
        if (document.getElementsByClassName('seek').length) {
          document.getElementsByClassName('seek')[0].classList.add('seeking');
        }
      });
      audioTag.addEventListener('pause', () => {
        this.playerState = PlayerState.Paused;
      });
      audioTag.addEventListener('playing', () => {
        this.playerState = PlayerState.Playing;
      });
      audioTag.addEventListener('seeked', () => {
        this.playTimePercentage = (100 / audioTag.duration) * audioTag.currentTime;

        if(this.playingPodcast) {
          this.playTime = audioTag.currentTime;
        }
      });
      audioTag.addEventListener('timeupdate', () => {
        this.playTimePercentage = (100 / audioTag.duration) * audioTag.currentTime;

        if(this.playingPodcast) {
          this.playTime = audioTag.currentTime;
        }
      });
      audioTag.addEventListener('seeking', () => {
        if (document.getElementsByClassName('seek-bar-wrapper').length) {
          document.getElementsByClassName('seek-bar-wrapper')[0].classList.add('seeking');
        }
      });
      audioTag.addEventListener('canplay', () => {
        this.duration = audioTag.duration;
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


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DatafruitsPlayer: typeof DatafruitsPlayer;
  }
}
  
