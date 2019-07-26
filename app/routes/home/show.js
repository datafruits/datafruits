import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';

export default Route.extend({
  model(params) {
    return this.store.loadRecord('scheduled-show', params.id);
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
    if(model.description){
      headTags['description'] = {
        type: 'meta',
        attrs: {
          name: 'twitter:description',
          content: model.description
        },
      }
    }
    if(model.tracks){
      headTags['player'] = {
        type: 'meta',
        attrs: {
          name: 'twitter:player',
          content: `https://datafruits.fm/container/shows/${model.id}`
        },
      };
    } //else change cardType to large image?
    if(model.imageUrl){
      headTags['image'] = {
        type: 'meta',
        attrs: {
          name: 'twitter:image',
          content: model.imageUrl
        },
      }
    }

    // TODO extract this to a function...
    this.set('headTags', Object.values({ ...ENV.headTags, ...headTags }));
  }
});
