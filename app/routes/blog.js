import Ember from 'ember';

export default Ember.Route.extend({
  fastboot: Ember.inject.service(),
  model: function(){
    return this.store.findAll('tumblr-post');
  },
  setupController: function(controller, model){
    this._super(controller, model);
    Ember.run.schedule('afterRender', this, function () {
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
