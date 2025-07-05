import Component from '@glimmer/component';
import { action } from '@ember/object';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import willDestroy from "@ember/render-modifiers/modifiers/will-destroy";

export default class WindowResizeHandler extends Component {<template><span {{didInsert this.didInsert}} {{willDestroy this.willDestroy}}>
</span>
</template>
  @action
  didInsert() {
    let _resize = () => {
      this.handleResize();
    };
    this._resize = _resize;
    window.addEventListener('resize', _resize);
    this.handleResize();
  }

  @action
  willDestroy() {
    super.willDestroy(...arguments);
    let _resize = this._resize;
    window.removeEventListener('resize', _resize);
  }

  handleResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
