import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from 'datafruits13/config/environment';
import { later } from '@ember/runloop';
import type VideoStreamService from "datafruits13/services/video-stream";

interface VisualsVideoWindowArgs {}

export default class VisualsVideoWindow extends Component<VisualsVideoWindowArgs> {
  @service declare videoStream: VideoStreamService;
  @service declare fastboot: any;

  @action
  initIfActive() {
    if (!this.fastboot.isFastBoot) {
      if (this.videoStream.active) {
        this.videoStream.initializePlayer();
      }
    }
  }

  @action
  didInsert() {
    if (!this.fastboot.isFastBoot) {
      if (this.videoStream.active) {
        this.videoStream.initializePlayer();
      } else {
        if (ENV.environment === 'test') return;
        later(() => {
          this.videoStream.fetchStream();
        }, 15000);
      }
    }
  }
}
