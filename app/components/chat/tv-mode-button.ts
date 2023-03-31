import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import VideoStreamService from '../../services/video-stream'
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';

export default class TvModeButton extends Component {
  get tvModeIcon() {
    if (this.videoStream.displaying) {
      return formatEmojiHtml(":tv:");
    } else {
      return formatEmojiHtml(":no_entry_sign:");
    }
  }

  @service
  declare videoStream: VideoStreamService;

  @action toggleDisplay() {
    this.videoStream.toggleDisplay();
  }
}
