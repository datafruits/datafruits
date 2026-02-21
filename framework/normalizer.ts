/**
 * Normalizer protocol for the datafruits custom framework.
 * Replaces @ember-data/serializer and @ember-data/serializer/json-api.
 *
 * A Normalizer transforms raw API responses into JSON:API documents
 * before they are pushed into the Store.
 */

import type { JsonApiDocument } from './api.js';

/**
 * Base normalizer.  The default behaviour expects the API to already return
 * valid JSON:API documents (which the datafruits backend does).
 *
 * Subclasses may override `normalize` to handle non-standard response shapes.
 */
export class Normalizer {
  /**
   * Transform a raw API response into a JSON:API document.
   * Return null to use the response as-is.
   */
  normalize(payload: unknown): JsonApiDocument | null {
    return null; // pass-through by default
  }
}

/**
 * Registry mapping model type strings to Normalizer instances.
 */
const normalizerRegistry = new Map<string, Normalizer>();

/**
 * Register a normalizer for a model type.
 */
export function registerNormalizer(typeName: string, normalizer: Normalizer): void {
  normalizerRegistry.set(typeName, normalizer);
}

/**
 * Look up a normalizer for a model type.
 * Returns null if no normalizer is registered (pass-through mode).
 */
export function lookupNormalizer(typeName: string): Normalizer | null {
  return normalizerRegistry.get(typeName) ?? null;
}
