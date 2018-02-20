import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { schedule } from '@ember/runloop';

export default Route.extend({
  fastboot: inject.service(),
  model: function(){
    return this.store.findAll('tumblr-post');
  },
  setupController: function(controller, model){
    this._super(controller, model);
    schedule('afterRender', this, function () {
      if(!this.get('fastboot.isFastBoot')){
        Ember.$('.grid').masonry({
          // options
          itemSelector: '.grid-item',
          columnWidth: 650,
          gutter: 20
        });
        Ember.$('.grid').imagesLoaded(function(){
          Ember.$(".grid").masonry();
        });
      }
    });
  }
});
