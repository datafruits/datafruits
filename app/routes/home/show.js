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
   const headTags = ENV.headTags.concat([
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
   ]);

   this.set('headTags', headTags);
  }
});
