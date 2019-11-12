import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

@classic
@tagName('')
export default class WindowResizeHandler extends Component {
  didInsertElement() {
    super.didInsertElement(...arguments);

    let _resize = () => { this.handleResize() };
    this.set('_resize', _resize);
    window.addEventListener('resize', _resize);
    this.handleResize();
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    let _resize = this._resize;
    window.removeEventListener('resize', _resize);
  }

  handleResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
