import Component from '@ember/component';

export default Component.extend({
  classNames: ['locale-selector'],
  init(){
    this._super(...arguments);
    this.locales = [
      {text: 'English', value: 'en'},
      {text: '日本語', value: 'ja'},
      {text: '한국어', value: 'kr'},
      {text: 'Español', value: 'es'}
    ];
  },
});
