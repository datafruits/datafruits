import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';

export default Route.extend({
  model(params) {
    return this.store.queryRecord('dj', { name: params.name });

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
         content: `datafruits.fm - ${model.username}`
       },
     },
     {
       type: 'meta',
       attrs: {
         name: 'twitter:description',
         content: model.bio
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
  },

  serialize(dj) {
    return {
      name: dj.get('name')
    };
  }
});
