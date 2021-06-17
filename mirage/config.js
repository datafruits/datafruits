import ENV from 'datafruits13/config/environment';

export default function () {
  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  this.urlPrefix = ENV.API_HOST; // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */
  this.get('/api/microtexts.json', (schema) => {
    return schema.microtexts.all();
  });

  this.get('/api/blog_posts.json', (/* schema */) => {
    return { blog_posts: [] };
  });

  this.get('/api/listeners/validate_username', () => {
    return { valid: true };
  });
  this.get('/api/listeners/validate_email', () => {
    return { valid: true };
  });

  this.get(
    '/podcasts/datafruits.json',
    () => {
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
    },
    200,
  );

  this.get(
    '/scheduled_shows.json',
    () => {
      return { scheduled_shows: [] };
    },
    200,
  );

  this.post('/api/listeners.json', (schema, request) => {
    const attrs = JSON.parse(request.requestBody).user;
    const user = schema.users.create(attrs);
    user.save();
    return { user: { id: '1', username: user.attrs.username, email: user.attrs.email } };
  });

  this.post('/users/sign_in', (schema, request) => {
    const attrs = JSON.parse(request.requestBody).user;
    const login = attrs.login;
    return { login: login, redirect: '/', success: true, token: 'xxxxxxxxx', user_id: 26 };
  });

  this.get('/users/current_user.json', (/* schema, request */) => {
    return {
      user: {
        avatar_url:
          'https://dongles.streampusher-relay.club/images/thumb/avatars-000049966766-qitxew-t500x500.jpg?1602655221',
        email: 'dj.nameko@datafruits.fm',
        id: 26,
        role: 'dj',
        social_identities: [],
        time_zone: 'UTC',
        username: 'djnameko',
      },
    };
  });
}
