import Component from '@ember/component';

export default Component.extend({
  didInsertElement(){
    if(window.twttr){
      window.twttr.widgets.load();
    }
  }
});
