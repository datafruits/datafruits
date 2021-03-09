import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import { later } from '@ember/runloop';
import ENV from 'datafruits13/config/environment';

@classic
@classNames('visuals')
export default class DatafruitsVisuals extends Component {
  @service
  fastboot;

  @service
  videoStream;

  @oneWay('videoStream.active')
  videoStreamActive;

  didRender() {
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

  didInsertElement() {
    this.videoStream.fetchStream();
  }
}
