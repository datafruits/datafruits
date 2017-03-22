import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findAll('tumblr-post');
  },
  setupController: function(controller, model){
    this._super(controller, model);
    Ember.run.schedule('afterRender', this, function () {
      $('.grid').masonry({
	// options
	itemSelector: '.grid-item',
	columnWidth: 650,
        gutter: 20
      });
      $('.grid').imagesLoaded(function(){
        $(".grid").masonry();
      });
    });
  }

});
