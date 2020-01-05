import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import { later } from '@ember/runloop';

export default Component.extend({
  classNames: ['visuals'],
  videoStream: service(),
  videoStreamActive: oneWay('videoStream.active'),

  didRender(){
    if(!this.get('fastboot.isFastBoot')){
      if(this.videoStreamActive){
        this.videoStream.initializePlayer();
      }else {
        later(()=> {
          this.videoStream.fetchStream();
        }, 15000);
      }
    }
  },

  didInsertElement(){
    this.videoStream.fetchStream();
  }
});
