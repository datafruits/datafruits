import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EmojiSelectorComponent extends Component {
  @tracked dialogOpen = false;
  @tracked currentTab; //"gif", "emoji", "fruitTip"

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
