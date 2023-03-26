import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { later } from '@ember/runloop';
import { action } from '@ember/object';
import ENV from 'datafruits13/config/environment';
export default class DatafruitsVisuals extends Component {

  get draggable() {
    if (this.videoStreamMode === 'tv') {
      return true;
    } else {
      return false;
    }
  }

  get styleProperties() {
    if (!this.videoDisplaying) {
      return 'display: none';
    }

    if (this.videoStreamMode === 'bg') {
      return `top: 0 !important; \
        left: 0 !important; \
        width: 100vw !important; \
        height: 100vh !important; \
        z-index: -999`;
    }
    return "";
  }

  @service
  fastboot;

  @service
  videoStream;

  get videoStreamMode() {
    return this.videoStream.mode;
  }

  get videoDisplaying() {
    return this.videoStream.displaying;
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
