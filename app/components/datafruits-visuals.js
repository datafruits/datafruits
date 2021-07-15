import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import Component from '@glimmer/component';
import { later } from '@ember/runloop';
import { action } from '@ember/object';
import ENV from 'datafruits13/config/environment';

export default class DatafruitsVisuals extends Component {
  @service
  fastboot;

  @service
  videoStream;

  @oneWay('videoStream.active')
  videoStreamActive;

  @action
  didInsert() {
    if (!this.fastboot.isFastBoot) {
      if (this.videoStreamActive) {
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
