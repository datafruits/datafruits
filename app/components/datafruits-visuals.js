import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import { later } from '@ember/runloop';
//import computedStyle from 'ember-computed-style';
import { observes } from '@ember-decorators/object';
import { tracked } from '@glimmer/tracking';

@classic
@classNames('visuals')
export default class DatafruitsVisuals extends Component {
  @tracked top = 0;
  @tracked left = 0;
  @tracked width = '100vw';
  @tracked height = '100vh';
  get styleProperties() {
    return `top: ${this.top}; left: ${this.left}; width: ${this.width}; height: ${this.height}`;
  }

  @service
  videoStream;

  @oneWay('videoStream.active')
  videoStreamActive;

  @oneWay('videoStream.mode')
  videoStreamMode; // off, bg, tv

  @observes('videoStreamMode')
  setTvMode() {
    if(this.videoStreamMode === 'tv'){
      this.draggable = true;
      this.width = "300px";
      this.height = "300px";
    }else{
      this.draggable = false;
      this.width = "100vw";
      this.height = "100vh";
    }
  }

  // @tracked x;
  // @tracked y;
  //init(){
    //this.style = computedStyle('styleProperties');
    // this.attributeBindings = this.style;
  //   super.init(...arguments);
  // }

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
    this.set('left', event.clientX);
    this.set('top', event.clientY);
    //this.element.style = `top: ${this.x}; left: ${this.y}`;
  }
}
