import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class GifPreviewComponent extends Component {
  @tracked previewUrl = this.args.gif.previewUrl;
  @action
  toggleBigGif() {
    this.previewUrl = this.args.gif.url;
    console.log('big');
  }

  @action
  toggleSmallGif() {
    this.previewUrl = this.args.gif.previewUrl;
    console.log('small');
  }
}
