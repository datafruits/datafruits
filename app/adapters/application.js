/**
 * Application adapter – replaced @ember-data/adapter/json-api with the
 * custom framework's Adapter base class.
 *
 * The default URL convention mirrors the old behaviour:
 *   host + /api/ + snake_case_plural + .json
 */
export { Adapter as default } from '../../../framework/index.js';
