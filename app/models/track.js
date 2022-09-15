import classic from 'ember-classic-decorator';
import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

@classic
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
  title;

  @attr()
  podcastPublishedDate;

  @hasMany('label')
  labels;

  @belongsTo('podcast')
  podcast;

  @belongsTo('scheduled-show')
  scheduledShow;

  @belongsTo('dj')
  dj;

  get labelNames() {
    return this.labels.map((label) => { return label.name });
  }
}
