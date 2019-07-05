import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: service(),

  init() {
    this._super(...arguments);
    this.on('routeDidChange', () =>  {
      if (typeof FastBoot === 'undefined') {
        this._trackPage();
      }
    });
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.url;
      const title = this.getWithDefault('currentRouteName', 'unknown');

      this.metrics.trackPage({ page, title });
    });
  }

});

Router.map(function() {
  this.route('home', { path: '/' }, function(){
    this.route('timetable');
    this.route('podcasts');
    this.route('about');
    this.route('subscribe');
    this.route('show', {path: '/shows/:id'});
    this.route('dj-inquiry');
    this.route('coc');
    this.route('djs');
    this.route('dj', { path: '/djs/:name' });
    this.route('chat');
  });
  this.route('container', {path: '/container'}, function(){
    this.route('show', {path: '/shows/:id'});
  });
  this.route('not-found', {path: '/*path'});
});

export default Router;
