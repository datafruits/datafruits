import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { get } from '@ember/object';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: service(),

  didTransition() {
    this._super(...arguments);
    if (typeof FastBoot === 'undefined') {
      this._trackPage();
    }
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');

      get(this, 'metrics').trackPage({ page, title });
    });
  }

});

Router.map(function() {
  this.route('timetable');
  this.route('podcasts');
  this.route('about');
  this.route('subscribe');
  this.route('show', {path: '/shows/:id'});
  this.route('dj-inquiry');
  this.route('coc');
  this.route('dj', { path: '/djs/:name' });
  this.route('chat');
  this.route('blog', {path: '/'});
});

export default Router;
