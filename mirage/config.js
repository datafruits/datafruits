import { createServer } from 'miragejs';
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
}
