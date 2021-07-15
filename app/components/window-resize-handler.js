import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class WindowResizeHandler extends Component {
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
