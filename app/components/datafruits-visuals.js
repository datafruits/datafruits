import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import { later } from '@ember/runloop';

@classic
@classNames('visuals')
export default class DatafruitsVisuals extends Component {
  @service
  videoStream;

  @oneWay('videoStream.active')
  videoStreamActive;

  @oneWay('videoStream.mode')
  videoStreamMode; // off, bg, tv

  didRender() {
    if(!this.get('fastboot.isFastBoot')){
      if(this.videoStreamActive){
        this.videoStream.initializePlayer();
      }else {
        later(()=> {
          this.videoStream.fetchStream();
        }, 15000);
      }
    }
  }

  didInsertElement() {
    this.videoStream.fetchStream();
  }
}
