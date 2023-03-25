import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import VideoStreamService from '../../services/video-stream'
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import { tracked } from '@glimmer/tracking';

export default class TvModeButton extends Component {
  @tracked
  showingViz = true;

  get tvModeIcon() {
    if (this.showingViz) {
      return formatEmojiHtml(":tv:");
    } else {
      return formatEmojiHtml(":no_entry_sign:");
    }
  }

  @service declare videoStream: VideoStreamService;

  @action
  toggle() {
    this.showingViz = !this.showingViz;
    this.videoStream.toggleMode();
  }
}
