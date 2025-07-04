import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { tracked } from '@glimmer/tracking';
import fruitTypes from '../../fruit-types';
import emojione from 'emojione';
import { htmlSafe } from '@ember/template';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';

export default class EmojiSelectorComponent extends Component {
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
