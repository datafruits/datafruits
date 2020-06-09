import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

@classic
@classNames('visuals')
export default class DatafruitsVisuals extends Component {
  @service
  videoStream;

  get videoStreamActive() {
    return this.videoStream.active;
  }

  didRender() {
    if(!this.get('fastboot.isFastBoot')){
      if(this.videoStream.active){
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
