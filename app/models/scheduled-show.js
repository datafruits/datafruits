import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ScheduledShow extends Model {
  @belongsTo('show-series', { async: true, inverse: null }) showSeries;
  @hasMany('recording', { async: false, inverse: null }) recording;
  @hasMany('post', {
    async: false,
    inverse: null,
  })
  posts;
  @hasMany('label', {
    async: false,
    inverse: null,
  })
  labels;
  @hasMany('track', {
    async: false,
    inverse: 'scheduledShow',
  })
  tracks;

  // TODO merge user/dj model
  @hasMany('user', {
    async: false,
    inverse: null,
  })
  djs;

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
  image;

  @attr()
  thumbImageUrl;

  @attr()
  description;

  @attr()
  hostedBy;

  @attr()
  hosts;

  @attr()
  hostAvatarUrl;

  get host() {
    return this.djs[0];
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

  get firstTrack() {
    return this.tracks[0];
  }

  get imageOrDefault() {
    if (this.asImageUrl) return this.asImageUrl;
    if (this.imageUrl) return this.imageUrl;
    if (this.thumbImageUrl) return this.thumbImageUrl;
    const seriesImage = this.showSeries.get?.('imageUrl') || this.showSeries.get?.('thumbImageUrl');
    if (seriesImage) return seriesImage;
    return '/assets/images/show_placeholder.jpg';
  }

  get airDatePassed() {
    return new Date(this.end) < new Date();
  }
}
