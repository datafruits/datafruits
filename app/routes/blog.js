import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import $ from 'jquery';

export default Route.extend({
  fastboot: service(),
  model: function(){
    let shoebox = this.get('fastboot.shoebox');
    let shoeboxStore = shoebox.retrieve('my-store');
    let isFastBoot = this.get('fastboot.isFastBoot');

    if (isFastBoot) {
      return this.store.findAll('tumblr-post').then(posts => {
        if (!shoeboxStore) {
          shoeboxStore = [];
          shoebox.put('my-store', shoeboxStore);
          posts.forEach((post) => {
            shoeboxStore.pushObject(post.toJSON());
          });
        }
      });
    }
    return shoeboxStore;
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
