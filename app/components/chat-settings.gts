import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { formatEmojiHtml } from "datafruits13/helpers/format-emoji-html";
import type ChatService from "datafruits13/services/chat";
import type VideoStreamService from "datafruits13/services/video-stream";
import { on } from "@ember/modifier";
import Modal from "./ui/modal.ts";
import EnableGifsButton from "./chat/enable-gifs-button.js";
import TvModeButton from "./chat/tv-mode-button.js";
import ColorPicker from "./chat/color-picker.js";

export default class ChatSettings extends Component {<template><button type="button" class="cool-button" {{on "click" this.toggleDialog}} title="Show the chat settings">
  {{this.gearIcon}}
</button>
{{#if this.showingDialog}}
  <Modal @toggleModal={{this.closeDialog}}>
    <div class="modal-body m-1">
      <EnableGifsButton @toggleGifs={{this.toggleGifsEnabled}} @enabled={{this.chat.gifsEnabled}} />
      {{#if this.videoStream.active}}
        <TvModeButton @toggleVideo={{this.toggleVideo}} @enabled={{this.videoStream.displaying}} />
      {{/if}}
      <ColorPicker />
    </div>
  </Modal>
{{/if}}</template>
  @service declare chat: ChatService;
  @service declare videoStream: VideoStreamService;
  @tracked declare showingDialog: boolean;
  get gearIcon() {
    return formatEmojiHtml(":gear:");
  }

  @action
  toggleDialog() {
    this.showingDialog = !this.showingDialog;
  }

  @action
  closeDialog() {
    this.showingDialog = false;
  }

  @action
  toggleGifsEnabled() {
    this.chat.gifsEnabled = !this.chat.gifsEnabled;
  }

  @action
  toggleVideo() {
    this.videoStream.toggleDisplay();
  }
}

declare module "@glint/environment-ember-loose/registry" {
  export default interface Registry {
    ChatSettings: typeof ChatSettings;
  }
}
