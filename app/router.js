import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

const Router = Ember.Router.extend(googlePageview, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('timetable');
  this.route('podcasts');
  this.route('about');
  this.route('subscribe');
  this.route('show', {path: '/shows/:id'});
  this.route('dj-inquiry');
  this.route('chat', {path: '/'});
  this.route('coc');
});

export default Router;
