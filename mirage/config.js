import { createServer, Response } from 'miragejs';
import {
  discoverEmberDataModels,
} from 'ember-cli-mirage';
import ENV from 'datafruits13/config/environment';

export default function (config) {
    let finalConfig = {
    ...config,
    models: {
      ...discoverEmberDataModels(config.store),
      ...config.models
    },
    routes,
  };

  return createServer(finalConfig);
}

function routes(){
  this.urlPrefix = ENV.API_HOST;
  this.logging = true;

  this.get('/api/microtexts.json', (schema) => {
    return schema.microtexts.all();
  });

  this.get('/api/shrimpos.json', (schema) => {
    return schema.shrimpos.all();
  });

  this.get('/api/shrimpos/:id', (schema, request) => {
    let id = request.params.id;
    return schema.shrimpos.find(id);
  });

  this.get('/api/blog_posts.json', () => {
    return { blog_posts: [] };
  });

  this.get('/api/listeners/validate_username', () => {
    return { valid: true };
  });

  this.get('/api/listeners/validate_email', () => {
    return { valid: true };
  });

  this.get('/podcasts/datafruits.json', () => {
    return {
      podcast: {
        id: '1',
        name: 'datafruits',
        tracks: [],
      },
      tracks: [],
      labels: [],
      meta: {},
    };
  });

  this.get('/scheduled_shows.json', () => {
    return { scheduled_shows: [] };
  });

  this.post('/api/listeners.json', (schema, request) => {
    const attrs = JSON.parse(request.requestBody).user;
    const user = schema.users.create(attrs);
    user.save();

    return {
      data: {
        id: 1,
        type: 'users',
        attributes: {
          username: user.attrs.username,
          email: user.attrs.email,
          time_zone: 'UTC',
          role: 'listener',
          avatar_url: null,
          style: 'unknown',
          avatar: null,
          avatar_filename: null,
          pronouns: '',
          track_favorites: [],
        },
        relationships: {
          track_favorites: { data: [] },
          social_identities: { data: [] },
        },
      },
    };
  });

  this.post('/users/sign_in', (schema, request) => {
    const attrs = JSON.parse(request.requestBody).user;
    const login = attrs.login;

    return {
      login: login,
      redirect: '/',
      success: true,
      token: 'xxxxxxxxx',
      id: 26,
      test: 'hey',
    };
  });

  this.get('/users/current_user.json', () => {
    return {
      data: {
        id: '937',
        type: 'users',
        attributes: {
          username: 'djnameko',
          email: 'dj.nameko@datafruits.fm',
          time_zone: 'UTC',
          role: 'listener',
          avatar_url: null,
          style: 'unknown',
          avatar: null,
          avatar_filename: null,
          pronouns: '',
          track_favorites: [],
        },
        relationships: {
          track_favorites: { data: [] },
          social_identities: { data: [] },
        },
      },
    };
  });

  // Scheduled show (episode) endpoints for my-shows/episode-form tests
  this.get('/api/show_series/:show_series_id/episodes/:id.json', (schema, request) => {
    const { id, show_series_id } = request.params;
    return {
      data: {
        id: id,
        type: 'scheduled-shows',
        attributes: {
          title: 'Test Episode',
          description: 'A test episode for testing purposes',
          start: '2024-01-01T12:00:00.000Z',
          end: '2024-01-01T13:00:00.000Z',
          'image-url': null,
          'image-filename': null,
          image: null,
          'thumb-image-url': null,
          status: 'archive_unpublished',
          slug: 'test-episode',
          'show-series-title': 'Test Show',
          'show-series-slug': 'test-show',
          'youtube-link': '',
          'mixcloud-link': '',
          'soundcloud-link': ''
        },
        relationships: {
          'show-series': {
            data: { id: show_series_id, type: 'show-series' }
          },
          recording: { data: null },
          labels: { data: [] },
          djs: { data: [{ id: '937', type: 'users' }] }
        }
      }
    };
  });

  this.patch('/api/my_shows/:show_series_slug/episodes/:episode_slug.json', (schema, request) => {
    const attrs = JSON.parse(request.requestBody);
    const { show_series_slug, episode_slug } = request.params;
    
    return {
      data: {
        id: '1',
        type: 'scheduled-shows',
        attributes: {
          ...attrs.data.attributes,
          slug: episode_slug,
          'show-series-slug': show_series_slug
        },
        relationships: {
          'show-series': {
            data: { id: '1', type: 'show-series' }
          },
          recording: { data: null },
          labels: { data: [] },
          djs: { data: [{ id: '937', type: 'users' }] }
        }
      }
    };
  });

  this.delete('/api/my_shows/:show_series_slug/episodes/:id.json', () => {
    return new Response(204, {}, '');
  });
}
