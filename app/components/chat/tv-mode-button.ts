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

  get deactivateVideoIcon() {
    return formatEmojiHtml(":electric_plug:");
  }

  @service 
  declare videoStream: VideoStreamService;

  @action
  toggleDisplay() {
    this.showingViz = !this.showingViz;
    this.videoStream.toggleDisplay();
  }

  @action
  deactivateVideo() {
    if (confirm("Continue with disconnecting the video? The entire page must be refreshed if you wish to see the video again.")) {
      this.videoStream.disposePlayer()
    }
  }
}
