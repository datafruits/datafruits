import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

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
      }
    }
  }
}
