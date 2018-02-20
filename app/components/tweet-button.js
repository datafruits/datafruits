import Component from '@ember/component';

export default Component.extend({
  didInsertElement(){
    twttr.widgets.load();
  }
});
