import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';

export default Route.extend({
  model(params){
    return this.store.findRecord('blogPost', params.id);
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
    };
    if(model.imageUrl){
      headTags['image'] = {
        type: 'meta',
        attrs: {
          name: 'twitter:image',
          content: model.blogPostBodies.firstObject.previewImage.s3Url
        },
      }
    }

    // TODO extract this to a function...
    this.set('headTags', Object.values({ ...ENV.headTags, ...headTags }));
  }
});
