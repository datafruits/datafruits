import classic from 'ember-classic-decorator';
import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

@classic
export default class ScheduledShow extends Model {
  @belongsTo('show-series', { async: false }) showSeries;
  @belongsTo('recording', { async: false }) recording;
  @hasMany('posts', { async: false }) posts;
  @hasMany('label', { async: false }) labels;

  @attr()
  start;

  @attr()
  end;

  @attr()
  title;

  @attr()
  formattedEpisodeTitle;

  @attr()
  imageUrl;

  @attr()
  imageFilename;

  @attr()
  image;

  @attr()
  thumbImageUrl;

  @attr()
  description;

  @attr()
  hostedBy;

  @attr()
  status;

  @hasMany('track')
  tracks;

  @hasMany('user') // TODO merge the user and dj models together
  djs;

  get host() {
    return this.djs.get('firstObject');
  }

  @attr()
  tweetContent;

  @attr()
  isGuest;

  @attr()
  guest;

  @attr()
  slug;

  @attr()
  status;

  @attr
  showSeriesTitle;

  @attr
  showSeriesSlug;

  @attr
  prerecordTrackId;

  get imageOrDefault() {
    if(this.imageUrl) {
      return this.imageUrl;
    } else {
      return this.showSeries.imageUrl;
    }
  }

  get airDatePassed() {
    return new Date(this.end) < new Date();
  }
}
