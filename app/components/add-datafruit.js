import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  classNames: ['add-datafruits'],
  chat: service(),
  store: service(),
  showingDatafruits: true,
  init(){
    this._super(...arguments);
    this.set('datafruit', this.store.createRecord('microtext'));
  },
  isSubmittable: computed('datafruit.{name, content}', function(){
    let datafruit = this.datafruit;
    return !isEmpty(datafruit.content) && !isEmpty(datafruit.name) && !datafruit.isSaving;
  }),
  actions: {
    addDatafruit(){
      this.set('showingDatafruits', false);
    },
    submit(){
      this.datafruit.save().then(() => {
        this.set('showingDatafruits', true);
      }).catch(() => {
        console.log("couldn't save datafruit");
      });
    }
  }
});
