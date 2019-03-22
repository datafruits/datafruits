import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { later, run } from '@ember/runloop';
import $ from 'jquery';

export default Component.extend({
  playingPodcast: false,
  title: "",
  muted: false,
  showingVolumeControl: false,
  playerState: "paused", //"playing", "loading"
  playButtonPressed: false,
  volume: 0.8,
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
    this._super(...arguments);
  },
  isLive: computed('title', function(){
    return this.title.startsWith("LIVE");
  }),
  pollRadioTitle() {
    let _this = this;
    later(function() {
      _this.setRadioTitle();
      _this.pollRadioTitle();
    }, 10000);
  },
  setRadioTitle() {
    if(!this.playingPodcast){
      let url = "https://streampusher-relay.club/status-json.xsl";

      $.get(url).done((data) => {
        let datafruits = data.icestats.source.find((s) => {
          return s.server_name == "datafruits.ogg";
        });
        let title = datafruits.title;
        if(title.substring(0, 3) === " - "){
          title = title.slice(3);
        }
        run(() => {
          this.set('error', null);
          this.set('title', title);
        });
      }).fail((data, textStatus) => {
        console.log(data);
        console.log(textStatus);
      });
    }
  },
  onTrackPlayed(track){
    this.set('error', null);
    this.set('title', track.title);
    this.set('playingPodcast', true);
  },
  actions: {
    playButtonMouseEnter(){
      this.set('playButtonHover', true);
    },
    playButtonMouseOut(){
      this.set('playButtonHover', false);
    },
    playLiveStream(){
      // $("#radio-player").jPlayer("setMedia", this.stream);
      // $("#radio-player").jPlayer("play");
      this.set('playingPodcast', false);
      this.setRadioTitle();
    },
    play(){
      let audioTag = document.getElementById("radio-player");
      console.log(`readyState: ${audioTag.readyState}`);
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
      if(this.playingPodcast === false){
        // reload stream
        audioTag.src = "https://streampusher-relay.club/datafruits.mp3";
      }
    },
    mute(){
      let audioTag = document.getElementById("radio-player");
      audioTag.muted = true;
      this.set('muted', true);
    },
    unmute(){
      let audioTag = document.getElementById("radio-player");
      audioTag.muted = false;
      this.set('muted', false);
    },
    toggleVolumeControl(){
      this.toggleProperty('showingVolumeControl');
    },
    volumeChanged(e){
      console.log(e.target.value);
      this.set('volume', e.target.value);
      let audioTag = document.getElementById("radio-player");
      audioTag.volume = this.volume;
    }
  },
  classNames: ['radio-bar'],
  classNameBindings: ['playingPodcast', 'isLive', 'playButtonHover:bleed:pink-bg'],
  playingPodcast: false,
  eventBus: service(),
  didInsertElement(){
    let audioTag = document.getElementById("radio-player");
    audioTag.addEventListener("loadstart", () => {
      console.log('loadstart');
      if(this.get('playButtonPressed') === true){
        this.set('playerState', 'loading');
      }
    });
    audioTag.addEventListener("canplay", () => {
      console.log('canplay');
    });
    audioTag.addEventListener("pause", () => {
      this.set('playerState', 'paused');
      console.log('pause');
    });
    audioTag.addEventListener("playing", () => {
      this.set('playerState', 'playing');
      console.log('playing');
    });
    this.setRadioTitle();
    this.pollRadioTitle();
  },
});
