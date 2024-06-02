import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { later } from '@ember/runloop';
import { action } from '@ember/object';
import ENV from 'datafruits13/config/environment';
export default class DatafruitsVisuals extends Component {

  get draggable() {
    if (this.videoStream.mode === 'tv') {
      return true;
    } else {
      return false;
    }
  }

  get styleProperties() {
    console.log(this.videoStream.mode);

    if (!this.videoStream.displaying) {
      return 'display: none';
    }

    if (this.videoStream.mode === 'bg') {
      return `top: 0 !important; \
        left: 0 !important; \
        width: 100vw !important; \
        height: 100vh !important; \
        z-index: -999`;
    }

    if (this.videoStream.mode === 'tv') {
      return `top: 100px !important; \
        left: 250px !important; \
        width: 300px !important; \
        height: 300px !important; \
        z-index: 1`;
    }
    return "";
  }

  @service
  fastboot;

  @service
  videoStream;

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
    if(this.videoStream.mode === "tv"){
      this.left = event.clientX;
      this.top = event.clientY;
    }
    //this.element.style = `top: ${this.x}; left: ${this.y}`;
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DatafruitsVisuals: typeof DatafruitsVisuals;
  }
}
  
