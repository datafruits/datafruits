import EmberRouter from '@ember/routing/router';
import config from 'datafruits13/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('home', { path: '' }, function () {
    this.route('index', { path: '/' });
    this.route('timetable');
    this.route('podcasts');
    this.route('about');
    this.route('subscribe');
    this.route('show', { path: '/shows/:id' });
    this.route('dj-inquiry');
    this.route('coc');
    this.route('djs');
    this.route('dj', { path: '/djs/:name' });
    this.route('chat');
    this.route('cat');
    this.route('hat');
    this.route('blogs.show', { path: '/blogs/:id' });
    this.route('sign-up');
    this.route('login');
    this.route('password-reset');
    this.route('user', function () {
      this.route('settings');
      this.route('favorites');
    });
    this.route('site-settings');
    this.route('wiki', function() {
      this.route('edit');
      this.route('history');
    });
    this.route('wiki.show', { path: '/wiki/:title' });
    this.route('wiki.new', { path: '/wiki/new' });
    this.route('wiki.edit', { path: '/wiki/:title/edit' });
    this.route('wiki.history', { path: '/wiki/:title/history' });
  });
  this.route('container', function () {
    this.route('show', { path: '/shows/:id' });
  });
  this.route('not-found', { path: '/*path' });
});
