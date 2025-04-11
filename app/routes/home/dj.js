import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';

export default class DjRoute extends Route {
  model(params) {
    return this.store.queryRecord('dj', { name: params.name });
  }

  afterModel(model) {
    this.setHeadTags(model);
  }

  setHeadTags(model) {
    const headTags = {
      title: {
        type: 'meta',
        attrs: {
          name: 'twitter:title',
          content: `datafruits.fm - ${model.username}`,
        },
      },
      description: {
        type: 'meta',
        attrs: {
          name: 'twitter:description',
          content: model.bio,
        },
      },
      image: {
        type: 'meta',
        attrs: {
          name: 'twitter:image',
          content: model.imageUrl,
        },
      },
      card: {
        type: 'meta',
        attrs: {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      },
    };

    this.headTags = Object.values({ ...ENV.headTags, ...headTags });
  }

  serialize(dj) {
    return {
      name: dj.get('name'),
    };
  }
}
