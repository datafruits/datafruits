import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';

export default Route.extend({
  model(params) {
    return this.store.findRecord('scheduled-show', params.id);
  },

  afterModel(model) {
   this.setHeadTags(model);
  },

  setHeadTags(model) {
   const headTags = {
     title: {
       type: 'meta',
       attrs: {
         name: 'twitter:title',
         content: `datafruits.fm - ${model.title}`
       },
     },
     description: {
       type: 'meta',
       attrs: {
         name: 'twitter:description',
         content: model.description
       },
     },
     image: {
       type: 'meta',
       attrs: {
         name: 'twitter:image',
         content: model.imageUrl
       },
     },
   };

   if(model.tracks){
     headTags['player'] = {
       type: 'meta',
       attrs: {
         name: 'twitter:player',
         content: `https://datafruits.fm/container/shows/${model.id}`
       },
     };
   }

   this.set('headTags', Object.values({ ...ENV.headTags, ...headTags }));
  }
});
