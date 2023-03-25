import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import VideoStreamService from '../../services/video-stream'
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import { tracked } from '@glimmer/tracking';

export default class TvModeButton extends Component {
  @tracked
  showingViz = true;

  @tracked
  vizFitted = false;

  get tvModeIcon() {
    if (this.showingViz) {
      return formatEmojiHtml(":tv:");
    } else {
      return formatEmojiHtml(":no_entry_sign:");
    }
  }

  get tvPositionIcon() {
    if (this.vizFitted) {
      return formatEmojiHtml(":white_small_square:")
    } else {
      return formatEmojiHtml(":white_large_square:");
    }
  }

  @service declare videoStream: VideoStreamService;

  @action
  toggleDisplay() {
    this.showingViz = !this.showingViz;
    this.videoStream.toggleDisplay();
  }

  @action
  toggleMode() {
    this.vizFitted = !this.vizFitted;
    this.videoStream.toggleMode();
  }
}
