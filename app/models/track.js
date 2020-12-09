import classic from 'ember-classic-decorator';
import { mapBy } from '@ember/object/computed';
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

  @belongsTo('scheduled-show', { inverse: null })
  scheduledShow;

  @belongsTo('dj')
  dj;

  @mapBy('labels', 'name')
  labelNames;
}
