import DS from 'ember-data';
import { computed } from '@ember/object';
import moment from 'moment';

export default DS.Model.extend({
  username: DS.attr(),
  imageUrl: DS.attr(),
  imageThumbUrl: DS.attr(),
  imageMediumUrl: DS.attr(),
  bio: DS.attr(),
  links: DS.hasMany('link'),
  tracks: DS.hasMany('track'),
  scheduledShows: DS.hasMany('scheduled-show'),
  nextShow: computed('scheduledShows', function(){
    return this.scheduledShows.filter((scheduledShow) => {
      return moment(scheduledShow.start).isSameOrAfter(Date.now());
    }).get('firstObject');
  })
});
