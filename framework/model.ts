/**
 * Type alias for synchronous has-many relationships (replaces Ember Data's SyncHasMany).
 * In the custom framework, has-many relationships are plain arrays.
 */
export type SyncHasMany<T> = T[];

/**
 * Base Model class for the datafruits custom framework.
 * Replaces @ember-data/model.
 *
 * Models are plain TypeScript classes decorated with field descriptors.
 * The data is deserialized from JSON:API payloads by the Store.
 */

export type ModelId = string | number;

export interface JsonApiResource {
  id?: ModelId;
  type: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<
    string,
    { data: JsonApiRelationshipData | JsonApiRelationshipData[] | null }
  >;
}

export type JsonApiRelationshipData = { id: ModelId; type: string };

/**
 * Base class for all datafruits models.
 * Subclasses declare their fields and relationships as plain class properties.
 */
export class Model {
  id: ModelId | null = null;

  /** Populated by the Store after deserialization. */
  _type: string = '';

  /**
   * Serialize this model back to a JSON:API resource object.
   * Override in subclasses if custom serialization is needed.
   */
  toJsonApi(): JsonApiResource {
    const attributes: Record<string, unknown> = {};
    for (const key of Object.keys(this)) {
      if (key === 'id' || key.startsWith('_')) continue;
      attributes[key] = (this as Record<string, unknown>)[key];
    }
    const resource: JsonApiResource = {
      type: this._type,
      attributes,
    };
    if (this.id != null) {
      resource.id = this.id;
    }
    return resource;
  }
}

/**
 * Decorator that marks a class property as a JSON:API attribute.
 *
 * Usage:
 *   class User extends Model {
 *     @attr() declare username: string;
 *     @attr('string') declare email: string;
 *   }
 */
export function attr(_type?: string): PropertyDecorator {
  return (_target: object, _key: string | symbol) => {
    // Attributes are plain class properties; the Store hydrates them directly.
    // This decorator currently acts as documentation / future type coercion hook.
  };
}

/**
 * Decorator that declares a belongs-to relationship.
 *
 * Usage:
 *   class Episode extends Model {
 *     @belongsTo('show-series') declare showSeries: ShowSeries;
 *   }
 */
export function belongsTo(_modelName: string, _options?: object): PropertyDecorator {
  return (_target: object, _key: string | symbol) => {
    // Resolved by the Store when the record is hydrated.
  };
}

/**
 * Decorator that declares a has-many relationship.
 *
 * Usage:
 *   class ShowSeries extends Model {
 *     @hasMany('scheduled-show') declare episodes: ScheduledShow[];
 *   }
 */
export function hasMany(_modelName: string, _options?: object): PropertyDecorator {
  return (_target: object, _key: string | symbol) => {
    // Resolved by the Store when the record is hydrated.
  };
}

/** Registry mapping JSON:API type strings to Model subclass constructors. */
const modelRegistry = new Map<string, new () => Model>();

/**
 * Register a model class so the Store can instantiate it.
 *
 * Usage:
 *   registerModel('user', User);
 */
export function registerModel(typeName: string, ModelClass: new () => Model): void {
  modelRegistry.set(typeName, ModelClass);
}

/**
 * Look up a registered model class by type name.
 * Returns `null` if no matching class has been registered.
 */
export function lookupModel(typeName: string): (new () => Model) | null {
  return modelRegistry.get(typeName) ?? null;
}
