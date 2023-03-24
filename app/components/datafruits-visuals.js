import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { later } from '@ember/runloop';
import { observes } from '@ember-decorators/object';
import { action } from '@ember/object';
import ENV from 'datafruits13/config/environment';
import { tracked } from '@glimmer/tracking';

export default class DatafruitsVisuals extends Component {

  get draggable() {
    if(this.videoStreamMode === 'tv'){
      return true;
    }else{
      return false;
    }
  }

  get styleProperties() {
    if(this.videoStreamMode === 'tv'){
      return `top: 0 !important; left: 0 !important; width: 300px !important; height: 300px !important; z-index: 1`;
    } else {
      return `top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: -999`;
    }
  }

  @service
  fastboot;

  @service
  videoStream;

  @oneWay('videoStream.mode')
  videoStreamMode; // off, bg, tv

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

  dragStart(event) {
    console.log('dragStart');
    console.log(event);
  }

  drag(event) {
    console.log('drag');
    console.log(event);
  }

  dragEnd(event) {
    console.log('dragEnd');
    console.log(event);
    if(this.videoStreamMode === "tv"){
      this.left = event.clientX;
      this.top = event.clientY;
    }
    //this.element.style = `top: ${this.x}; left: ${this.y}`;
  }
}
