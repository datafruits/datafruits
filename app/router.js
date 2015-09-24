import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

var Router = Ember.Router.extend(googlePageview, {
  location: config.locationType
});

Router.map(function() {
  this.route('timetable');
  this.route('podcasts');
  this.route('about');
  this.route('subscribe');
  this.resource('show', {path: '/shows/:id'});
});

export default Router;
