import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fruitTypes from '../fruit-types';

export default class EmojiSelectorComponent extends Component {
  get randomFruitImage() {
    return fruitTypes[Math.floor(Math.random() * fruitTypes.length)].image;
  }

  @tracked dialogOpen = false;
  @tracked currentTab; //"gif", "emoji", "fruitTip"

  @action
  closeDialog() {
    this.dialogOpen = false;
  }

  @action
  openGifDialog(){
    this.dialogOpen = true;
    this.currentTab = 'gif';
  }

  @action
  openFruittipDialog(){
    this.dialogOpen = true;
    this.currentTab = 'fruitTip';
  }

  @action
  openEmojiDialog(){
    this.dialogOpen = true;
    this.currentTab = 'emoji';
  }
}
