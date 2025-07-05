import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Component from '@glimmer/component';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import VideoStreamService from 'datafruits13/services/video-stream';
import type Track from 'datafruits13/models/track';
import ENV from 'datafruits13/config/environment';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import Icon from "./ui/icon.js";
import and from "ember-truth-helpers/helpers/and";

enum PlayerState {
  Playing = 'playing',
  Loading = 'loading',
  Paused = 'paused',
  Seeking = 'seeking'
}

export default class DatafruitsPlayer extends Component {<template><div id="now-playing-bar" class="flex-col flex justify-center classic:bg-df-pink blm:bg-black trans:bg-df-blue text-xl py-2 text-white leading-none
        {{if this.playingPodcast "playing-podcast" ""}}
        {{if this.isLive "is-live" ""}}
        {{if this.playButtonHover "bleed" ""}}
         " {{didInsert this.didInsert}}>
  <audio preload id="radio-player" class="hidden">
    <source src="https://streampusher-relay.club/datafruits.mp3" type="audio/mp3">
    <source src="https://streampusher-relay.club/datafruits.ogg" type="audio/ogg">
  </audio>
  <div class="radio-container flex flex-row justify-between items-center text-3xl text-shadow">
    <div class="player-controls mx-2 flex space-x-2">
      {{#if this.playingPodcast}}
        <a aria-label={{t "player.aria.return_to_live"}} href="javascript:;" role="button" {{on "click" this.playLiveStream}}>
          <Icon @name="chevron-left" alt={{t "return_to_live"}} />
        </a>
      {{/if}}
      {{#if this.loading}}
        <div id="loading-stream" name="loading-stream" class="player-loading">
        </div>
      {{else if this.playing}}
        <a id="pause-stream" name="pause-stream" role="button" aria-label={{t "player.aria.stop"}} {{on "click" this.pause}} class="jp-pause" tabindex="0">
          {{t (if this.playingPodcast "player.pause" "player.stop")}}
        </a>
      {{else if this.paused}}
        <a id="play-stream" name="play-stream" class="jp-play" href="#" tabindex="0" role="button" aria-label={{t "player.aria.play"}} title={{t "player.aria.play"}} {{on "click" this.play}} {{on "mouseenter" this.playButtonMouseEnter}} {{on "mouseleave" this.playButtonMouseOut}}>
          {{t "player.play"}}
        </a>
      {{/if}}
      <span id="volume-control" name="volume-control" role="button" class="jp-volume-controls" aria-label={{t "player.aria.volume"}} {{on "mouseenter" this.showVolumeControl}} {{on "mouseleave" this.hideVolumeControl}}>
        {{#if this.muted}}
          {{!-- template-lint-disable no-nested-interactive --}}
          <a class="jp-unmute" tabindex="0" role="button" title={{t "player.aria.unmute"}} aria-label={{t "player.aria.unmute"}} {{on "click" this.unmute}}>
            <Icon @name="volume-off" />
          </a>
        {{else}}
          <a class="jp-mute" tabindex="0" role="button" title={{t "player.aria.mute"}} aria-label={{t "player.aria.mute"}} {{on "click" this.mute}}>
            <Icon @name="volume-up" />
          </a>
        {{/if}}
        {{#if this.showingVolumeControl}}
          <input class="volume-control" type="range" min="0" max="1" step="0.01" aria-label={{t "player.aria.volume"}} {{on "input" this.volumeChanged}} value={{this.volume}}>
          <span class="hidden md:inline-block">{{this.volumeString}}</span>
        {{/if}}
      </span>
    </div>
    <div class="now-playing flex-grow overflow-hidden text-base sm:text-3xl sm:whitespace-nowrap">
      {{#if this.error}}
        <span>
          {{this.error}}
        </span>
      {{else}}
        <span class="jp-title">
          {{this.title}}
        </span>
      {{/if}}
    </div>
    {{#if (and this.playingPodcast this.playing)}}
      <span class="mx-2 text-base leading-4">
        {{this.formattedPlayTime}}
      </span>
    {{/if}}
    <div class="flex mr-1 items-center">
      {{yield}}
    </div>
  </div>
  {{#if this.playingPodcast}}
    <div class="seek">
      <div class="seek-bar-wrapper">
        <input class="seek-bar m-0 sm:mt-4 sm:mb-4" type="range" step="any" {{on "input" this.seek}} value={{this.playTimePercentage}}>
      </div>
    </div>
  {{/if}}
</div></template>
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
  @tracked title = "";
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

  get volumeString(): string {
    return `${Math.floor(Number(this.volume) * 100).toString()}%`;
  }

  get paused(): boolean {
    return this.playerState === PlayerState.Paused;
  }

  get playing(): boolean {
    return this.playerState === PlayerState.Playing;
  }

  get loading(): boolean {
    return this.playerState === PlayerState.Loading;
  }

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.eventBus.subscribe("trackPlayed", this, "onTrackPlayed");
    this.eventBus.subscribe("metadataUpdate", this, "setRadioTitle");
    this.eventBus.subscribe("liveVideoAudio", this, "useVideoAudio");
    this.eventBus.subscribe("liveVideoAudioOff", this, "disableVideoAudio");

    if (!this.fastboot.isFastBoot) {
      this.volume =
        parseFloat(localStorage.getItem("datafruits-volume") as string) || 0.8;
    }
  }

  get isLive() {
    const title = this.title;
    return !isEmpty(title) && title.startsWith("LIVE");
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

    const audioTag = document.getElementById(
      "radio-player"
    ) as HTMLAudioElement;
    audioTag.src = track.cdnUrl;
    if (audioTag.readyState === 0) {
      this.playerState = PlayerState.Loading;
    }
    audioTag.play().catch((e) => {
      console.error('Audio play failed', e);
    });
  }

  useVideoAudio() {
    //this.error = null;
    this.videoAudioOn = true;

    const audioTag = document.getElementById(
      "radio-player"
    ) as HTMLAudioElement;
    audioTag.muted = true;
    this.videoStream.unmute();
  }

  disableVideoAudio() {
    this.videoAudioOn = false;
    const audioTag = document.getElementById(
      "radio-player"
    ) as HTMLAudioElement;
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
    const audioTag = document.getElementById(
      "radio-player"
    ) as HTMLAudioElement;
    audioTag.pause();
    this.playingPodcast = false;
    this.setRadioTitle();
    audioTag.src = `${ENV.ICECAST_HOST}/datafruits.mp3`;
    audioTag.play().catch((e) => {
      console.error('Audio play failed', e);
    });
  }

  @action
  play() {
    const audioTag = document.getElementById(
      "radio-player"
    ) as HTMLAudioElement;
    if (this.playingPodcast === false) {
      // reload stream
      audioTag.src = `${ENV.ICECAST_HOST}/datafruits.mp3`;
    }
    if (audioTag.readyState === 0) {
      this.playerState = PlayerState.Loading;
    }
    audioTag.play().catch((e) => {
      console.error('Audio play failed', e);
    });
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
      const audioTag = document.getElementById(
        "radio-player"
      ) as HTMLAudioElement;
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
      const audioTag = document.getElementById(
        "radio-player"
      ) as HTMLAudioElement;
      audioTag.muted = true;
    }
    this.muted = true;
    this.oldVolume = this.volume;
    this.volume = 0.0;
    localStorage.setItem("datafruits-volume", this.volume.toString());
  }

  @action
  unmute() {
    if (this.videoAudioOn) {
      this.videoStream.unmute();
    } else {
      const audioTag = document.getElementById(
        "radio-player"
      ) as HTMLAudioElement;
      audioTag.muted = false;
    }
    this.muted = false;
    this.volume = this.oldVolume;
    localStorage.setItem("datafruits-volume", this.volume.toString());
  }

  @action
  showVolumeControl() {
    this.showingVolumeControl = true;
  }

  @action
  hideVolumeControl() {
    if (this.showingVolumeControl) {
      debounce(this, this._hideVolumeControl.bind(this), 3000);
    }
  }

  _hideVolumeControl() {
    this.showingVolumeControl = false;
  }

  @action
  volumeChanged(e: any) {
    this.volume = e.target.value;
    localStorage.setItem("datafruits-volume", this.volume.toString());
    if (this.videoAudioOn) {
      this.videoStream.setVolume(this.volume);
    } else {
      const audioTag = document.getElementById(
        "radio-player"
      ) as HTMLAudioElement;
      audioTag.volume = this.volume;
    }
  }

  @action
  seek(e: any) {
    const audioTag = document.getElementById(
      "radio-player"
    ) as HTMLAudioElement;
    const time = audioTag.duration * (e.target.value / 100);

    audioTag.currentTime = time;
  }

  get formattedPlayTime() {
    if (this.playTime) {
      return `${this._formatTime(this.playTime)} / ${this._formatTime(
        this.duration
      )}`;
    } else {
      return "...";
    }
  }

  _formatTime(time: number) {
    const hours = Math.floor(time / (60 * 60));
    const minutes = Math.floor(time / 60) % 60;
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  @action
  didInsert() {
    if (!this.fastboot.isFastBoot) {
      const audioTag = document.getElementById(
        "radio-player"
      ) as HTMLAudioElement;

      audioTag.addEventListener("loadstart", () => {
        if (this.playButtonPressed === true) {
          this.playerState = PlayerState.Seeking;
          if (audioTag.readyState === 0) {
            this.playerState = PlayerState.Loading;
          }
        }
        if (document.getElementsByClassName("seek").length) {
          document.getElementsByClassName("seek")[0].classList.add("seeking");
        }
      });
      audioTag.addEventListener("pause", () => {
        this.playerState = PlayerState.Paused;
      });
      audioTag.addEventListener("playing", () => {
        this.playerState = PlayerState.Playing;
      });
      audioTag.addEventListener("seeked", () => {
        this.playTimePercentage =
          (100 / audioTag.duration) * audioTag.currentTime;

        if (this.playingPodcast) {
          this.playTime = audioTag.currentTime;
        }
      });
      audioTag.addEventListener("timeupdate", () => {
        this.playTimePercentage =
          (100 / audioTag.duration) * audioTag.currentTime;

        if (this.playingPodcast) {
          this.playTime = audioTag.currentTime;
        }
      });
      audioTag.addEventListener("seeking", () => {
        if (document.getElementsByClassName("seek-bar-wrapper").length) {
          document
            .getElementsByClassName("seek-bar-wrapper")[0]
            .classList.add("seeking");
        }
      });
      audioTag.addEventListener("canplay", () => {
        this.duration = audioTag.duration;
        if (document.getElementsByClassName("seek-bar-wrapper").length) {
          document
            .getElementsByClassName("seek-bar-wrapper")[0]
            .classList.remove("seeking");
        }
        if (document.getElementsByClassName("seek").length) {
          document
            .getElementsByClassName("seek")[0]
            .classList.remove("seeking");
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

