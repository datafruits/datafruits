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
    this.route('shows');
    this.route('show', { path: '/shows/:slug' });
    // eslint-disable-next-line ember/routes-segments-snake-case
    this.route('shows.episode', { path: '/shows/:showSeriesSlug/episodes/:slug' });
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
    this.route('new-password');
    this.route('user', function () {
      this.route('settings');
      this.route('favorites');
      this.route('my-shows');
      this.route('my-shows.new', { path: 'my-shows/new' });
      this.route('my-shows.edit', { path: 'my-shows/:slug/edit' });
      this.route('my-shows.episodes', { path: 'my-shows/:slug/episodes' });
      this.route('my-shows.episode', { path: 'my-shows/:show_slug/episode/:slug' });
      this.route('notifications');
    });
    this.route('site-settings');
    this.route('wiki', function() {
    });
    this.route('wiki.show', { path: '/wiki/:title' });
    this.route('wiki.new', { path: '/wiki/new' });
    this.route('wiki.edit', { path: '/wiki/:title/edit' });
    this.route('wiki.history', { path: '/wiki/:title/history' });
    this.route('forum', function() {
    });
    this.route('forum.new', { path: '/forum/new' });
    this.route('forum.show', { path: '/forum/:title' });
    this.route('shrimpos');
    this.route('shrimpos.new', { path: '/shrimpos/new' });
    this.route('shrimpos.show', { path: '/shrimpos/:title' });
    this.route('support');
  });
  this.route('container', function () {
    this.route('show', { path: '/shows/:id' });
  });
  this.route('not-found', { path: '/*path' });
});
