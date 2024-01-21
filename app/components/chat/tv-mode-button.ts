import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import VideoStreamService from "datafruits13/services/video-stream";

export default class TvModeButton extends Component {
  @service
  declare videoStream: VideoStreamService;

  @action toggleDisplay() {
    this.videoStream.toggleDisplay();
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TvModeButton: typeof TvModeButton;
  }
}

