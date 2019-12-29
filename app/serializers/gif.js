import DS from 'ember-data';
const { JSONAPISerializer } = DS;

export default JSONAPISerializer.extend({
  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    payload = payload.data.map((gif) => {
      gif.attributes = {
        "preview-url": gif.images.fixed_width_small.url,
        url: gif.images.original.url,
        slug: gif.slug
      };
      return gif;
    });
    return this._super(...arguments);
  }
});
