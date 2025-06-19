import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class Sticker extends JSONAPISerializer {
  normalizeQueryResponse(store, primaryModelClass, payload /*, id, requestType*/) {
    payload.data.map((gif) => {
      gif.type = 'sticker';
      gif.attributes = {
        'preview-url': gif.images.fixed_width.url,
        url: gif.images.original.url,
        slug: gif.slug,
      };
      return gif;
    });
    return super.normalizeQueryResponse(...arguments);
  }
}
