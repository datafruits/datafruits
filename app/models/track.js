import { Model, attr, hasMany, belongsTo } from '../../framework/index.js';

export default class Track extends Model {
  @attr()
  audioFileName;

  @attr()
  cdnUrl;

  @attr()
  soundcloudKey;

  @attr()
  mixcloudKey;

  @attr()
  youtubeLink;

  @attr()
  title;

  @attr()
  podcastPublishedDate;

  @hasMany('label', {
    async: false,
    inverse: null
  }) labels;

  @belongsTo('podcast', { async: true, inverse: 'tracks' }) podcast;

  @belongsTo('scheduled-show', { async: true, inverse: 'track' }) scheduledShow;

  @belongsTo('dj', { async: true, inverse: 'tracks' }) dj;

  get labelNames() {
    return this.labels.map((label) => { return label.name; });
  }

  get fileName() {
    return this.audioFileName.split("/").pop();
  }
}
