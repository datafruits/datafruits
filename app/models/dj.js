import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import moment from 'moment';

export default Model.extend({
  username: attr(),
  imageUrl: attr(),
  imageThumbUrl: attr(),
  imageMediumUrl: attr(),
  bio: attr(),
  links: hasMany('link'),
  tracks: hasMany('track'),
  scheduledShows: hasMany('scheduled-show'),
  nextShow: computed('scheduledShows', function(){
    return this.scheduledShows.filter((scheduledShow) => {
      return moment(scheduledShow.start).isSameOrAfter(Date.now());
    }).get('firstObject');
  })
});
