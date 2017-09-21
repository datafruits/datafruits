import Route from '@ember/routing/route';

<<<<<<< HEAD
export default Route.extend({
  model(params) {
    return this.store.find('scheduled-show', params.id);
=======
export default Ember.Route.extend({
  fastboot: Ember.inject.service(),
  model(params) {
    let shoebox = this.get('fastboot.shoebox');
    let shoeboxStore = shoebox.retrieve('my-store');
    let isFastBoot = this.get('fastboot.isFastBoot');

    if(isFastBoot){
      return fetch('https://datafruits.streampusher.com/scheduled_shows/'+params.id+'.json')
      .then((response) => {
        return response.json().then((json) => {
          if(!shoeboxStore){
            shoeboxStore = {};
            shoebox.put('my-store', shoeboxStore);
          }
          shoeboxStore[params.id] = json;
        });
      });
    }
    return shoeboxStore[params.id];
>>>>>>> use shoebox in routes
  },

  afterModel: function(model) {
    this.setHeadTags(model);
  },
  //
  setHeadTags: function (model) {
   var headTags = [
     {
       type: 'meta',
       attrs: {
         name: 'twitter:card',
         content: 'summary_large_image'
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:site',
         content: '@datafruits'
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:creator',
         content: '@datafruits'
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:title',
         content: `datafruits.fm - ${model.title}`
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:description',
         content: model.description
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:image',
         content: model.image_url
       },
     },
   ];

   this.set('headTags', headTags);
  }
});
