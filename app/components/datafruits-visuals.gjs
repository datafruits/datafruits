import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { later } from '@ember/runloop';
import { action } from '@ember/object';
import ENV from 'datafruits13/config/environment';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import didUpdate from "@ember/render-modifiers/modifiers/did-update";
import Video from "./visuals/video.ts";
export default class DatafruitsVisuals extends Component {<template><div {{didInsert this.didInsert}} {{didUpdate this.initIfActive this.videoStream.active}} class="visuals">
  {{#if this.videoStream.active}}
    <Video @styleProperties={{this.styleProperties}} @draggable={{this.draggable}} />
  {{/if}}
</div>
</template>

  get draggable() {
    if (this.videoStream.mode === 'tv') {
      return true;
    } else {
      return false;
    }
  }

  get styleProperties() {
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
