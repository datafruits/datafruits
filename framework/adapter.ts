/**
 * Adapter protocol for the datafruits custom framework.
 * Replaces @ember-data/adapter and @ember-data/adapter/json-api.
 *
 * An Adapter defines how URL paths are constructed for a given model type.
 * The Store consults the adapter registry before falling back to the default
 * URL conventions in ApiClient.
 */

import type { ApiClient, JsonApiDocument } from './api.js';
import type { Model, ModelId } from './model.js';

export interface AdapterQueryParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Base adapter class.  Subclasses may override individual url* methods to
 * customise the URL for a particular operation.
 */
export class Adapter {
  /** The API namespace, e.g. 'api'. Prepended to the path. */
  namespace: string = 'api';

  /** URL prefix used by url* methods. */
  urlPrefix(): string {
    return '';
  }

  urlForFindAll(_type: string): string | null {
    return null;
  }

  urlForFindRecord(_id: ModelId, _type: string, _options?: unknown): string | null {
    return null;
  }

  urlForQuery(_query: AdapterQueryParams, _type: string): string | null {
    return null;
  }

  urlForQueryRecord(_query: AdapterQueryParams, _type: string): string | null {
    return null;
  }

  urlForCreateRecord(_type: string, _record: Model): string | null {
    return null;
  }

  urlForUpdateRecord(_id: ModelId, _type: string, _record: Model): string | null {
    return null;
  }

  urlForDeleteRecord(_id: ModelId, _type: string, _record: Model): string | null {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Hooks (optional – adapters may override to customise request behaviour)
  // ---------------------------------------------------------------------------

  /**
   * Perform a findAll using this adapter. Return null to fall through to
   * the default ApiClient behaviour.
   */
  findAll(_client: ApiClient, _type: string): Promise<JsonApiDocument> | null {
    return null;
  }

  /**
   * Perform a query using this adapter. Return null to fall through to
   * the default ApiClient behaviour.
   */
  query(_client: ApiClient, _type: string, _params: AdapterQueryParams): Promise<JsonApiDocument> | null {
    return null;
  }
}

/**
 * Registry mapping model type strings to Adapter instances.
 */
const adapterRegistry = new Map<string, Adapter>();

/**
 * Register an adapter for a model type.
 *
 * Usage:
 *   registerAdapter('scheduledShow', new ScheduledShowAdapter());
 */
export function registerAdapter(typeName: string, adapter: Adapter): void {
  adapterRegistry.set(typeName, adapter);
}

/**
 * Look up an adapter for a model type.
 * Falls back to the default Adapter if none is registered.
 */
export function lookupAdapter(typeName: string): Adapter {
  return adapterRegistry.get(typeName) ?? adapterRegistry.get('application') ?? new Adapter();
}
