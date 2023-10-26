import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';
import { metaToHeadTags } from 'ember-cli-meta-tags';

export default class ShowRoute extends Route {
  meta() {
    return metaToHeadTags({
      property: {
          'twitter:title': `datafruits.fm - ${this.model.title}`,
      },
    });
  }

  model(params) {
    return this.store.findRecord('show-series', params.slug);
  }

  // afterModel(model) {
  //   this.setHeadTags(model);
  // }

  setHeadTags(model) {
    const headTags = {
      property: {
          'twitter:title': `datafruits.fm - ${model.title}`,
      },
    };
    if (model.description) {
      headTags['description'] = {
        type: 'meta',
        attrs: {
          name: 'twitter:description',
          content: model.description,
        },
      };
    }
    if (model.tracks) {
      headTags['player'] = {
        type: 'meta',
        attrs: {
          name: 'twitter:player',
          content: `https://datafruits.fm/container/shows/${model.id}`,
        },
      };
    } //else change cardType to large image?
    if (model.imageUrl) {
      headTags['image'] = {
        type: 'meta',
        attrs: {
          name: 'twitter:image',
          content: model.imageUrl,
        },
      };
    }

    // TODO extract this to a function...
    //this.headTags = Object.values({ ...ENV.headTags, ...headTags });
  }
}
