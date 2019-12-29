import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  didInsertElement(){
    this._super(...arguments);

    let _resize = () => { this.handleResize() };
    this.set('_resize', _resize);
    window.addEventListener('resize', _resize);
    this.handleResize();
  },
  willDestroyElement(){
    this._super(...arguments);

    let _resize = this._resize;
    window.removeEventListener('resize', _resize);
  },
  handleResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
});
