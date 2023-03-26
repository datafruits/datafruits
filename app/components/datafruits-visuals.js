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

    if(this.videoStreamMode === 'tv'){
      let navbarHeight = Math.max(
        document.querySelector('#mobile-navbar').clientHeight,
        document.querySelector('#desktop-navbar').clientHeight
      );
      navbarHeight+=10;
      let windowHeight = document.querySelector('body').clientHeight;
      let tvWidth = document.querySelector('body').clientWidth;
      let nowPlaying = document.querySelector('#now-playing-bar').clientHeight + 200;
      let addDatafruit = document.querySelector('#add-datafruit-bar').clientHeight;
      let tvHeight = windowHeight - (nowPlaying - addDatafruit);
      tvHeight;

      return `border: dashed red !important; \
        top: ${navbarHeight}px !important; \
        left: 0 !important; \
        width: ${tvWidth}px !important; \
        height: ${tvHeight}px !important; \
        z-index: 1`;
    } else if (this.videoStreamMode === 'bg') {
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

  // @oneWay('videoStream.mode')
  // videoStreamMode; // bg, tv
  get videoStreamMode() {
    return this.videoStream.mode;
  }

  // @oneWay('videoStream.displaying')
  // videoDisplaying;
  get videoDisplaying() {
    return this.videoDisplaying;
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
