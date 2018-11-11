import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import $ from 'jquery';
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
  setupController: function(controller, model){
    this._super(controller, model);
    schedule('afterRender', this, function () {
      if(!this.get('fastboot.isFastBoot')){
        $('.grid').masonry({
          // options
          itemSelector: '.grid-item',
          columnWidth: 650,
          gutter: 20
        });
        $('.grid').imagesLoaded(function(){
          $(".grid").masonry();
        });
      }
    });
  }
});
