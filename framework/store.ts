/**
 * Data Store for the datafruits custom framework.
 * Replaces ember-data's Store service.
 *
 * Maintains an identity map of loaded records, deserializes JSON:API payloads
 * into Model instances, and delegates persistence to the ApiClient.
 */

import { Model, lookupModel, type JsonApiResource, type ModelId } from './model.js';
import { ApiClient, type ApiConfig, type JsonApiDocument } from './api.js';

/** An in-memory cache keyed by [type][id]. */
type IdentityMap = Map<string, Map<ModelId, Model>>;

/**
 * Converts a JSON:API type string (e.g. "show-series") to a camelCase model
 * name (e.g. "showSeries") used when looking up registered models.
 */
function dasherizedToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Convert a JSON:API attribute key (snake_case or kebab-case) to camelCase
 * so it matches the TypeScript class properties.
 */
function toCamelCase(str: string): string {
  return str
    .replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export class Store {
  private cache: IdentityMap = new Map();
  readonly client: ApiClient;

  constructor(config: ApiConfig) {
    this.client = new ApiClient(config);
  }

  // ---------------------------------------------------------------------------
  // Cache helpers
  // ---------------------------------------------------------------------------

  private getCacheFor(type: string): Map<ModelId, Model> {
    if (!this.cache.has(type)) {
      this.cache.set(type, new Map());
    }
    return this.cache.get(type)!;
  }

  /** Return a cached record, or null if not present. */
  peekRecord<T extends Model = Model>(type: string, id: ModelId): T | null {
    return (this.getCacheFor(type).get(id) as T) ?? null;
  }

  /** Return all cached records of a given type. */
  peekAll<T extends Model = Model>(type: string): T[] {
    return Array.from(this.getCacheFor(type).values()) as T[];
  }

  // ---------------------------------------------------------------------------
  // Deserialization
  // ---------------------------------------------------------------------------

  private hydrateResource(resource: JsonApiResource): Model {
    const { type, id, attributes = {}, relationships = {} } = resource;
    const cacheKey = dasherizedToCamel(type);
    const ModelClass = lookupModel(cacheKey) ?? lookupModel(type) ?? Model;

    const cacheMap = this.getCacheFor(type);

    let record: Model;
    if (id != null && cacheMap.has(id)) {
      record = cacheMap.get(id)!;
    } else {
      record = new ModelClass();
    }

    record._type = type;
    if (id != null) {
      record.id = id;
    }

    // Apply attributes
    for (const [key, value] of Object.entries(attributes)) {
      (record as Record<string, unknown>)[toCamelCase(key)] = value;
    }

    // Apply relationships (shallow – only ids/types, not full records)
    for (const [key, rel] of Object.entries(relationships)) {
      if (!rel.data) continue;
      const camelKey = toCamelCase(key);
      if (Array.isArray(rel.data)) {
        // has-many: store as array of { id, type } stubs
        (record as Record<string, unknown>)[camelKey] = rel.data;
      } else {
        // belongs-to: store as { id, type } stub
        (record as Record<string, unknown>)[camelKey] = rel.data;
      }
    }

    if (id != null) {
      cacheMap.set(id, record);
    }

    return record;
  }

  /** Push a raw JSON:API document into the cache and return the primary record(s). */
  push(document: JsonApiDocument): Model | Model[] {
    const { data, included = [] } = document;

    // Hydrate included (side-loaded) records first so relationships resolve correctly.
    for (const resource of included) {
      this.hydrateResource(resource);
    }

    if (Array.isArray(data)) {
      return data.map((r) => this.hydrateResource(r));
    }
    return this.hydrateResource(data);
  }

  // ---------------------------------------------------------------------------
  // Finders
  // ---------------------------------------------------------------------------

  async findAll<T extends Model = Model>(type: string): Promise<T[]> {
    const doc = await this.client.findAll(type);
    return this.push(doc) as T[];
  }

  async findRecord<T extends Model = Model>(type: string, id: ModelId): Promise<T> {
    const doc = await this.client.findRecord(type, id);
    return this.push(doc) as T;
  }

  async query<T extends Model = Model>(
    type: string,
    params: Record<string, string | number | boolean>
  ): Promise<T[]> {
    const doc = await this.client.query(type, params);
    return this.push(doc) as T[];
  }

  async queryRecord<T extends Model = Model>(
    type: string,
    params: Record<string, string | number | boolean>
  ): Promise<T | null> {
    const doc = await this.client.query(type, params);
    const records = this.push(doc);
    const arr = Array.isArray(records) ? records : [records];
    return (arr[0] as T) ?? null;
  }

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  /** Create a new (unsaved) model record of the given type. */
  createRecord<T extends Model = Model>(type: string, attrs: Partial<T> = {}): T {
    const ModelClass = lookupModel(dasherizedToCamel(type)) ?? lookupModel(type) ?? Model;
    const record = new ModelClass() as T;
    record._type = type;
    Object.assign(record, attrs);
    return record;
  }

  /** Persist a new or updated record to the API. */
  async saveRecord<T extends Model = Model>(record: T): Promise<T> {
    const payload: JsonApiDocument = {
      data: record.toJsonApi(),
    };

    let doc: JsonApiDocument;
    if (record.id != null) {
      doc = await this.client.updateRecord(record._type, record.id, payload);
    } else {
      doc = await this.client.createRecord(record._type, payload);
    }

    return this.push(doc) as T;
  }

  /** Delete a record from the API and remove it from the cache. */
  async deleteRecord<T extends Model = Model>(record: T): Promise<void> {
    if (record.id == null) return;
    await this.client.deleteRecord(record._type, record.id);
    this.getCacheFor(record._type).delete(record.id);
  }

  /** Remove all cached records (useful in tests or on logout). */
  unloadAll(type?: string): void {
    if (type) {
      this.cache.delete(type);
    } else {
      this.cache.clear();
    }
  }
}
