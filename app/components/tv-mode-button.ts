import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import VideoStreamService from '../services/video-stream'

export default class TvModeButton extends Component {
  @service declare videoStream: VideoStreamService;

  @action
  toggle() {
    this.videoStream.toggleMode();
  }
}
