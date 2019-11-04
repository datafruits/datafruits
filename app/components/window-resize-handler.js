import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  didInsertElement(){
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  },
  willDestroyElement(){
    window.removeEventListener('resize');
  }
});
