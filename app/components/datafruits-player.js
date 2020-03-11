import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  classNames: ['radio-bar'],
  classNameBindings: ['playingPodcast', 'isLive', 'playButtonHover:bleed:pink-bg'],
  eventBus: service(),
  fastboot: service(),
  metadata: service(),
  playingPodcast: false,
  title: "",
  muted: false,
  showingVolumeControl: false,
  playerState: "paused", //"playing", "loading"
  playButtonPressed: false,
  oldVolume: 0.8,
  playTime: 0.0,
  paused: computed('playerState', function(){
    return this.playerState === 'paused';
  }),
  playing: computed('playerState', function(){
    return this.playerState === 'playing';
  }),
  loading: computed('playerState', function(){
    return this.playerState === 'loading';
  }),
  init(){
    this.eventBus.subscribe("trackPlayed", this, "onTrackPlayed");
    this.eventBus.subscribe("metadataUpdate", this, "setRadioTitle");
    if(!this.get('fastboot.isFastBoot')){
      this.set('volume', localStorage.getItem('datafruits-volume') || 0.8);
    }
    this._super(...arguments);
  },
  isLive: computed('title', function(){
    const title = this.title;
    return !isEmpty(title) && title.startsWith("LIVE");
  }),
  setRadioTitle() {
    if(this.playingPodcast === false){
      this.set('title', this.metadata.title);
    }
  },
  onTrackPlayed(track){
    this.set('error', null);
    this.set('title', track.title);
    this.set('playingPodcast', true);
    this.set('playTime', 0.0);

    let audioTag = document.getElementById("radio-player");
    audioTag.src = track.cdnUrl;
    audioTag.play();
  },
  actions: {
    playButtonMouseEnter(){
      this.set('playButtonHover', true);
    },
    playButtonMouseOut(){
      this.set('playButtonHover', false);
    },
    playLiveStream(){
      this.set('playingPodcast', false);
      this.setRadioTitle();
    },
    play(){
      let audioTag = document.getElementById("radio-player");
      if(audioTag.readyState === 0){
        this.set('playerState', 'loading');
      }
      audioTag.play();
      this.set('playButtonHover', false);
      this.set('playButtonPressed', true);
    },
    pause(){
      let audioTag = document.getElementById("radio-player");
      audioTag.pause();
      this.set('playButtonPressed', false);
      this.set('playerState', 'paused');
      if(this.playingPodcast === false || this.isLive){
        // reload stream
        audioTag.src = "https://streampusher-relay.club/datafruits.mp3";
      }
    },
    mute(){
      let audioTag = document.getElementById("radio-player");
      audioTag.muted = true;
      this.set('muted', true);
      this.set('oldVolume', this.volume);
      this.set('volume', 0.0);
      localStorage.setItem('datafruits-volume', this.volume);
    },
    unmute(){
      let audioTag = document.getElementById("radio-player");
      audioTag.muted = false;
      this.set('muted', false);
      this.set('volume', this.oldVolume);
      localStorage.setItem('datafruits-volume', this.volume);
    },
    toggleVolumeControl(){
      this.toggleProperty('showingVolumeControl');
    },
    volumeChanged(e){
      this.set('volume', e.target.value);
      localStorage.setItem('datafruits-volume', this.volume);
      let audioTag = document.getElementById("radio-player");
      audioTag.volume = this.volume;
    },
    seek(e){
      let audioTag = document.getElementById("radio-player");
      const time = audioTag.duration * (e.target.value / 100);

      audioTag.currentTime = time;
    }
  },
  didInsertElement(){
    if(!this.get('fastboot.isFastBoot')){
      let audioTag = document.getElementById("radio-player");
      audioTag.addEventListener("loadstart", () => {
        if(this.playButtonPressed === true){
          this.set('playerState', 'seeking');
        }
        if(document.getElementsByClassName("seek").length){
          document.getElementsByClassName("seek")[0]
            .classList.add('seeking');
        }
      });
      audioTag.addEventListener("pause", () => {
        this.set('playerState', 'paused');
      });
      audioTag.addEventListener("playing", () => {
        this.set('playerState', 'playing');
      });
      audioTag.addEventListener("timeupdate", () => {
        const value = (100 / audioTag.duration) * audioTag.currentTime;

        this.set('playTime', value);
      });
      audioTag.addEventListener("seeking", () => {
        if(document.getElementsByClassName("seek-bar-wrapper").length){
          document.getElementsByClassName("seek-bar-wrapper")[0]
            .classList.add('seeking');
        }
      });
      audioTag.addEventListener("canplay", () => {
        if(document.getElementsByClassName("seek-bar-wrapper").length){
          document.getElementsByClassName("seek-bar-wrapper")[0]
            .classList.remove('seeking');
        }
        if(document.getElementsByClassName("seek").length){
          document.getElementsByClassName("seek")[0]
            .classList.remove('seeking');
        }
      });
      audioTag.volume = this.volume;
      this.setRadioTitle();
    }
  },
});
