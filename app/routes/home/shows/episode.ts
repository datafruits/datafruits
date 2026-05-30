import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'datafruits13/config/environment';

export default class HomeShowsEpisode extends Route {
  @service declare store: any;
  @service declare headData: any;
  declare headTags: any;

  model(params: any) {
    return this.store.findRecord('scheduled-show', params.slug, {
      adapterOptions: {
        show_series_id: params.showSeriesSlug, // :shrug:
      },
    });
  }

  afterModel(model: any) {
    this.headData.title = `datafruits.fm - ${model.title}`;
    this.headData.description = model.description;
    this.headData.image = model.imageOrDefault;
    this.setHeadTags(model);
  }

  setHeadTags(model: any) {
    const headTags = {
      title: {
        type: 'meta',
        attrs: {
          name: 'twitter:title',
          content: `datafruits.fm - ${model.title}`,
        },
      },
      description: {
        type: 'meta',
        attrs: {
          name: 'twitter:description',
          content: model.description,
        },
      },
      image: {
        type: 'meta',
        attrs: {
          name: 'twitter:image',
          content: model.imageOrDefault,
        },
      },
      card: {
        type: 'meta',
        attrs: {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      },
      ogTitle: {
        type: 'meta',
        attrs: {
          property: 'og:title',
          content: `datafruits.fm - ${model.title}`,
        },
      },
      ogDescription: {
        type: 'meta',
        attrs: {
          property: 'og:description',
          content: model.description,
        },
      },
      ogImage: {
        type: 'meta',
        attrs: {
          property: 'og:image',
          content: model.imageOrDefault,
        },
      },
    };

    this.headTags = Object.values({ ...ENV.headTags, ...headTags });
  }
}
