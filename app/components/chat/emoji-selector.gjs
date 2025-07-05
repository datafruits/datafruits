import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fruitTypes from '../../fruit-types';
import emojione from 'emojione';
import { htmlSafe } from '@ember/template';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import BuddyListButton from "./buddy-list-button.ts";
import ChatSettings from "../chat-settings.gts";
import Modal from "../ui/modal.gts";
import gte from "ember-truth-helpers/helpers/gte";
import eq from "ember-truth-helpers/helpers/equal";
import Gif from "../emoji-selector/gif.gjs";
import FruitTip from "../emoji-selector/fruit-tip.gts";
import Emoji from "../emoji-selector/emoji.gjs";
import Camera from "../emoji-selector/camera.gts";

export default class EmojiSelectorComponent extends Component {<template><span class="relative">
  {{!-- mobile view --}}
  <div class="inline-block md:hidden">
    <button class="cool-button" type="button" title={{t "chat.titles.emoji"}} {{on "click" this.openEmojiDialog}}>
      {{this.pineappleEmoji}}
    </button>
    <BuddyListButton />
  </div>
  {{!-- desktop view --}}
  <div class="hidden md:inline-block">
    <button class="cool-button" type="button" title={{t "chat.titles.gif"}} {{on "click" this.openGifDialog}}>
      {{t "chat.gif"}}
    </button>
    <button class="cool-button fruit-tip-button text-xl font-black" type="button" style="padding: 0.1em !important;" title={{t "chat.titles.fruits"}} {{on "click" this.openFruittipDialog}}>
      <span class="flex">
        <img src="{{this.randomFruitImage}}" style="height: 3ex !important;" width="33px" height="33px" alt="send fruit">
        <h1>{{this.fruitCountTotal}}</h1>
      </span>
    </button>
    <button class="cool-button" type="button" title={{t "chat.titles.emoji"}} {{on "click" this.openEmojiDialog}}>
      {{this.smileEmoji}}
    </button>
  </div>
  <ChatSettings />
  {{#if this.dialogOpen}}
    <Modal @toggleModal={{this.closeDialog}}>
      <div class="p-2 bg-df-blue overflow-scroll emoji-selector-dialog">
        <div class="flex-row flex justify-between">
          <button class="cool-button" type="button" title={{t "chat.titles.gif"}} {{on "click" this.openGifDialog}}>
            {{t "chat.gif"}}
          </button>
          <button class="cool-button fruit-tip-button text-xl font-black" type="button" style="padding: 0.1em !important;" title={{t "chat.titles.fruits"}} {{on "click" this.openFruittipDialog}}>
            <span class="flex">
              <img src="{{this.randomFruitImage}}" style="height: 3ex !important;" width="33px" height="33px" alt="send fruit">
              <h1>{{this.fruitCountTotal}}</h1>
            </span>
          </button>
          <button class="cool-button" type="button" title={{t "chat.titles.emoji"}} {{on "click" this.openEmojiDialog}}>
            {{this.smileEmoji}}
          </button>
          {{#if this.session.isAuthenticated}}
            {{#if (gte this.currentUser.user.level 4)}}
              <button class="cool-button" type="button" title={{t "chat.titles.camera"}} {{on "click" this.openCameraDialog}}>
                {{this.cameraEmoji}}
              </button>
            {{/if}}
          {{/if}}
        </div>
        {{#if (eq this.currentTab "gif")}}
          <Gif @closeDialog={{this.closeDialog}} @sendGif={{@sendGif}} />
        {{else if (eq this.currentTab "fruitTip")}}
          <FruitTip />
        {{else if (eq this.currentTab "emoji")}}
          <Emoji @closeDialog={{this.closeDialog}} @sendEmoji={{@sendEmoji}} />
        {{else if (eq this.currentTab "camera")}}
          <Camera @closeDialog={{this.closeDialog}} @sendPhoto={{@sendGif}} />
        {{/if}}
      </div>
    </Modal>
  {{/if}}
</span>
</template>
  @service
  currentUser;

  @service
  session;


  get pineappleEmoji() {
    return formatEmojiHtml(":pineapple:");
  }

  get smileEmoji() {
    return formatEmojiHtml(":smile:");
  }

  get cameraEmoji() {
    return formatEmojiHtml(":camera:");
  }

  get randomFruitImage() {
    return fruitTypes[Math.floor(Math.random() * fruitTypes.length)].image;
  }

  @tracked dialogOpen = false;
  @tracked currentTab; //"gif", "emoji", "fruitTip", "camera"

  @action
  closeDialog() {
    this.dialogOpen = false;
  }

  @action
  openGifDialog() {
    this.dialogOpen = true;
    this.currentTab = 'gif';
  }

  @action
  openFruittipDialog() {
    this.dialogOpen = true;
    this.currentTab = 'fruitTip';
  }

  @action
  openEmojiDialog() {
    this.dialogOpen = true;
    this.currentTab = 'emoji';
  }

  @action
  openCameraDialog() {
    this.dialogOpen = true;
    this.currentTab = 'camera';
  }
}
