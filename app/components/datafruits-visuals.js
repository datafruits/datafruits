import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { later } from '@ember/runloop';
import { observes } from '@ember-decorators/object';
import { action } from '@ember/object';
import ENV from 'datafruits13/config/environment';
import { tracked } from '@glimmer/tracking';

export default class DatafruitsVisuals extends Component {
  @tracked draggable = false;
  @tracked top = 0;
  @tracked left = 0;
  @tracked width = '100vw';
  @tracked height = '100vh';
  @tracked zIndex = '-999';
  get styleProperties() {
    return `top: ${this.top}px !important; left: ${this.left}px !important; width: ${this.width} !important; height: ${this.height} !important; z-index: ${this.zIndex}`;
  }

  @service
  fastboot;

  @service
  videoStream;

  @oneWay('videoStream.mode')
  videoStreamMode; // off, bg, tv

  @observes('videoStreamMode')
  setTvMode() {
    if(this.videoStreamMode === 'tv'){
      this.draggable = true;
      this.width = "300px";
      this.height = "300px";
      this.zIndex = '1';
    }else{
      this.draggable = false;
      this.width = "100vw";
      this.height = "100vh";
      this.zIndex = '-999';
    }
  }

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
