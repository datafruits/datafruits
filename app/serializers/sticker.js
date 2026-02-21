/**
 * Sticker normalizer – transforms Giphy sticker responses to JSON:API format.
 */
import { Normalizer } from '../../framework/index.js';

export default class StickerNormalizer extends Normalizer {
  normalize(payload) {
    if (!payload || !Array.isArray(payload.data)) return null;
    return {
      data: payload.data.map((gif) => ({
        id: gif.id,
        type: 'sticker',
        attributes: {
          'preview-url': gif.images?.fixed_width?.url ?? '',
          url: gif.images?.original?.url ?? '',
          slug: gif.slug ?? '',
        },
      })),
    };
  }
}
