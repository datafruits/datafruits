import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  isOffline: false,

  didInsertElement(){
    this._super(...arguments);

    let _update = () => { this.updateStatus() };
    this.set('_update', _update);

    window.addEventListener('online', _update);
    window.addEventListener('offline', _update);

    this.updateStatus();
  },

  willDestroyElement(){
    this._super(...arguments);
    let _update = this._update;
    window.removeEventListener('online', _update);
    window.removeEventListener('offline', _update);
  },

  updateStatus(){
    console.log('setting offline status');
    this.set('isOffline', !navigator.onLine);
  }

});
