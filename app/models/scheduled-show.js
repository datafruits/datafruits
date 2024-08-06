import classic from 'ember-classic-decorator';
import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

@classic
export default class ScheduledShow extends Model {
  @belongsTo('show-series', { async: true }) showSeries;
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
  hostAvatarUrl;

  @hasMany('track')
  tracks;

  // TODO merge user/dj model
  @hasMany('user', { async: false }) djs;

  get host() {
    return this.djs.get('firstObject');
  }

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

  @attr
  prerecordTrackFilename;

  @attr
  usePrerecordedFileForArchive;

  @attr
  youtubeLink;

  @attr
  mixcloudLink;

  @attr
  soundcloudLink;

  get imageOrDefault() {
    if(this.imageUrl) {
      return this.imageUrl;
    } else {
      return this.showSeries.get('imageUrl');
    }
  }

  get airDatePassed() {
    return new Date(this.end) < new Date();
  }
}
