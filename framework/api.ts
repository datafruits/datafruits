/**
 * Fetch-based API client for the datafruits custom framework.
 * Replaces @ember-data/adapter and @ember-data/adapter/json-api.
 *
 * Handles authentication headers, URL building, and JSON:API serialization.
 */

import type { JsonApiResource } from './model.js';

export interface ApiConfig {
  host: string;
  /** Returns the current auth token, or null if not authenticated. */
  getToken: () => string | null;
  /**
   * Optional namespace prefix added to all API paths (e.g. 'api').
   * Resulting URL becomes: {host}/{namespace}/{path}.json
   */
  namespace?: string;
}

export interface JsonApiDocument {
  data: JsonApiResource | JsonApiResource[];
  included?: JsonApiResource[];
  meta?: Record<string, unknown>;
  links?: Record<string, string>;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  /** Override the full path (relative to host, without .json) */
  pathOverride?: string;
}

/**
 * Converts a camelCase model type string to a URL-friendly pluralized underscore path.
 * e.g. "showSeries" -> "show_series"
 *      "scheduledShow" -> "scheduled_shows"
 */
function typeToPath(type: string): string {
  // camelCase -> snake_case
  const underscored = type.replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`);
  // simple pluralization (handles the most common English cases)
  if (underscored.endsWith('y')) {
    return underscored.slice(0, -1) + 'ies';
  }
  if (
    underscored.endsWith('s') ||
    underscored.endsWith('x') ||
    underscored.endsWith('z') ||
    underscored.endsWith('sh') ||
    underscored.endsWith('ch')
  ) {
    return underscored + 'es';
  }
  return underscored + 's';
}

/**
 * Low-level HTTP client used by the Store.
 */
export class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private buildHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    };
    const token = this.config.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const ns = this.config.namespace ? `${this.config.namespace}/` : '';
    const url = new URL(`${this.config.host}/${ns}${path}.json`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }

  async request<T = JsonApiDocument>(
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { method = 'GET', body, params, pathOverride } = options;
    const resolvedPath = pathOverride ?? path;
    const url = pathOverride
      ? (() => {
          const u = new URL(`${this.config.host}/${resolvedPath}.json`);
          return u.toString();
        })()
      : this.buildUrl(resolvedPath, params);

    const init: RequestInit = {
      method,
      headers: this.buildHeaders(),
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    const response = await fetch(url, init);

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new ApiError(response.status, errorText, response);
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    return response.json() as Promise<T>;
  }

  /** GET /api/{type} – find all records of a type */
  findAll(type: string): Promise<JsonApiDocument> {
    return this.request(typeToPath(type));
  }

  /** GET /api/{type}/{id} – find a single record */
  findRecord(type: string, id: string | number): Promise<JsonApiDocument> {
    return this.request(`${typeToPath(type)}/${id}`);
  }

  /** GET /api/{type}?{params} – query records with parameters */
  query(type: string, params: Record<string, string | number | boolean>): Promise<JsonApiDocument> {
    return this.request(typeToPath(type), { params });
  }

  /** POST /api/{type} – create a new record */
  createRecord(type: string, payload: JsonApiDocument): Promise<JsonApiDocument> {
    return this.request(typeToPath(type), { method: 'POST', body: payload });
  }

  /** PATCH /api/{type}/{id} – update an existing record */
  updateRecord(type: string, id: string | number, payload: JsonApiDocument): Promise<JsonApiDocument> {
    return this.request(`${typeToPath(type)}/${id}`, { method: 'PATCH', body: payload });
  }

  /** DELETE /api/{type}/{id} – destroy a record */
  deleteRecord(type: string, id: string | number): Promise<void> {
    return this.request<void>(`${typeToPath(type)}/${id}`, { method: 'DELETE' });
  }
}

/**
 * Error thrown when the API returns a non-2xx response.
 */
export class ApiError extends Error {
  status: number;
  response: Response;

  constructor(status: number, message: string, response: Response) {
    super(`API Error ${status}: ${message}`);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}
