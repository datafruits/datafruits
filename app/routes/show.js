import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.find('scheduled-show', params.id);
  },

  afterModel: function(model) {
   this.setHeadTags(model);
  },

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
