import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'datafruits13/config/environment';

export default Route.extend({
  fastboot: service(),
  model: function(){
    return this.store.findAll('tumblr-post');
  },

  afterModel() {
   this.setHeadTags();
  },

  setHeadTags() {
    const headTags = ENV.headTags;
    this.set('headTags', headTags);
  },
});
