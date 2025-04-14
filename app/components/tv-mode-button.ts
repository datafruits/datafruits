import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from "@ember/service";
import type VideoStreamService from "datafruits13/services/video-stream";

interface TvModeButtonArgs {}

export default class TvModeButton extends Component<TvModeButtonArgs> {
  @service declare videoStream: VideoStreamService;

  @action toggleMode() {
    this.videoStream.toggleMode();
  }
}
