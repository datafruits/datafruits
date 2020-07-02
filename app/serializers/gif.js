import classic from 'ember-classic-decorator';
import JSONAPISerializer from '@ember-data/serializer/json-api';

@classic
export default class Gif extends JSONAPISerializer {
  normalizeQueryResponse(store, primaryModelClass, payload/*, id, requestType*/) {
    payload.data.map((gif) => {
      gif.attributes = {
        "preview-url": gif.images.fixed_width.url,
        url: gif.images.original.url,
        slug: gif.slug
      };
      return gif;
    });
    return super.normalizeQueryResponse(...arguments);
  }
}
