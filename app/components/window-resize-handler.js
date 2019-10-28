import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  didInsertElement(){
    // We listen to the resize event
    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  },
  willDestroyElement(){
    window.removeEventListener('resize');
  }
});
