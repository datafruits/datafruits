import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('scheduled-show', params.id);
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
         content: 'player'
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
         content: model.imageUrl
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:player',
         content: "https://datafruits.fm/container"
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:player:width',
         content: "480"
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:player:height',
         content: "80"
       },
     },
   ];

   this.set('headTags', headTags);
  }
});
