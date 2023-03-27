import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';
import { service } from '@ember/service';
import type StoreService from '@ember-data/store';
import type ScheduledShowModel from 'datafruits13/models/scheduled-show';

export default class ShowRoute extends Route {
  @service declare store: StoreService;

  headTags: any;

  model(params: any) {
    return this.store.findRecord('scheduled-show', params.id);
  }

  afterModel(model: ScheduledShowModel) {
    this.setHeadTags(model);
  }

  setHeadTags(model: ScheduledShowModel) {
    const headTags: any = {
      title: {
        type: 'meta',
        attrs: {
          name: 'twitter:title',
          content: `datafruits.fm - ${model.title}`,
        },
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
    this.headTags = Object.values({ ...ENV.headTags, ...headTags });
  }
}
